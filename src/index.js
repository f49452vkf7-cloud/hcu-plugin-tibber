const WebSocket = require('ws');

const TIBBER_TOKEN = process.env.TIBBER_TOKEN;
const TIBBER_API_URL = "https://tibber.com";

const HCU_HOST = process.env.HCU_API_HOST || "localhost";
const HCU_PORT = process.env.HCU_API_PORT || "8080";
const HCU_TOKEN = process.env.HCU_API_TOKEN;

if (!TIBBER_TOKEN) {
    console.error("KRITISCHER FEHLER: Keine TIBBER_TOKEN Umgebungsvariable gesetzt.");
    process.exit(1);
}

if (!HCU_TOKEN) {
    console.error("KRITISCHER FEHLER: Kein HCU_API_TOKEN von der Zentrale bereitgestellt.");
    process.exit(1);
}

const hcuSocketUrl = `ws://${HCU_HOST}:${HCU_PORT}/api/v1/connect`;
const hcuWs = new WebSocket(hcuSocketUrl, {
    headers: { 'Authorization': `Bearer ${HCU_TOKEN}` }
});

hcuWs.on('open', () => {
    console.log('Erfolgreich an HCU Connect API authentifiziert.');
    fetchTibberPrice();
    fetchTibberConsumption();
    schedulePricePolling();
    startConsumptionPolling();
});

function updateHcuVariable(parameterId, value) {
    const payload = {
        jsonrpc: "2.0",
        method: "hcu/plugin/updateParameterValue",
        params: {
            deviceId: "tibber_monitor_device",
            channelId: "values",
            parameterId: parameterId,
            value: value
        },
        id: Date.now()
    };
    
    if (hcuWs.readyState === WebSocket.OPEN) {
        hcuWs.send(JSON.stringify(payload));
    }
}

async function queryTibber(graphQlQuery) {
    try {
        const response = await fetch(TIBBER_API_URL, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${TIBBER_TOKEN}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ query: graphQlQuery })
        });
        return await response.json();
    } catch (error) {
        console.error("API-Verbindungsfehler zu Tibber:", error);
        return null;
    }
}

async function fetchTibberPrice() {
    const query = `{ viewer { homes { currentSubscription { priceInfo { current { total } } } } } }`;
    const json = await queryTibber(query);
    
    const price = json?.data?.viewer?.homes?.[0]?.currentSubscription?.priceInfo?.current?.total;
    
    if (price !== undefined && price !== null) {
        console.log(`[Preis-Update] ${price} EUR`);
        updateHcuVariable("current_price", parseFloat(price));
    } else {
        console.error("Fehler beim Parsen des Tibber-Preises aus der API-Antwort.");
    }
}

function schedulePricePolling() {
    const now = new Date();
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();
    
    const nextQuarter = 15 - (minutes % 15);
    const delay = ((nextQuarter * 60) - seconds) * 1000;

    setTimeout(() => {
        fetchTibberPrice();
        setInterval(fetchTibberPrice, 15 * 60 * 1000);
    }, delay);
}

async function fetchTibberConsumption() {
    const query = `{ viewer { homes { consumption(resolution: HOURLY, last: 1) { nodes { accumulatedConsumption } } } } }`;
    const json = await queryTibber(query);
    
    const consumption = json?.data?.viewer?.homes?.[0]?.consumption?.nodes?.[0]?.accumulatedConsumption;
    
    if (consumption !== undefined && consumption !== null) {
        console.log(`[Verbrauchs-Update] ${consumption} kWh`);
        updateHcuVariable("pulse_consumption_today", parseFloat(consumption));
    } else {
        console.error("Fehler beim Parsen des Tibber-Verbrauchs aus der API-Antwort.");
    }
}

function startConsumptionPolling() {
    setInterval(fetchTibberConsumption, 3 * 60 * 1000);
}

hcuWs.on('error', (err) => console.error("HCU WebSocket Protokollfehler:", err));
hcuWs.on('close', () => {
    console.log("Verbindung zur HCU verloren. Beende Container...");
    process.exit(1);
});
