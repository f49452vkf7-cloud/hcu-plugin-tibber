# Homematic IP HCU - Tibber Integration Plugin

Dieses native Plugin für die **Homematic IP Home Control Unit (HCU)** integriert aktuelle Strompreise sowie Zählerstandsdaten Ihres Tibber Pulse Zählers über die offizielle eQ-3 Connect API. 

Es läuft ressourcenschonend im **reinen Intervallbetrieb** ohne dauerhafte Hintergrund-Streams.

## Features

- **Echtzeitnaher Strompreis:** Aktualisierung exakt im 15-Minuten-Raster (`:00`, `:15`, `:30`, `:45` der Stunde).
- **Tagesverbrauch:** Abfrage des akkumulierten Tagesverbrauchs (kWh) alle 3 Minuten.
- **Nativ integriert:** Erzeugt ein virtuelles Gerät "Tibber Monitor" direkt in der Homematic IP App für die Nutzung in Automatisierungen.

## Installation auf der HCU

1. Laden Sie die fertige `hcu-tibber-plugin.zip` aus den **Releases** dieses GitHub-Repositorys herunter.
2. Öffnen Sie die **HCUweb-Oberfläche** Ihrer Home Control Unit im Webbrowser.
3. Aktivieren Sie in den HCU-Systemeinstellungen den **Entwicklermodus**.
4. Navigieren Sie zu **Plugins** -> **Plugin hochladen** und wählen Sie die heruntergeladene ZIP-Datei aus.
5. Vergeben Sie in der HCUweb-Konfiguration des Plugins die erforderliche Umgebungsvariable (siehe Konfiguration).

## Konfiguration

Das Plugin benötigt zwingend Ihren persönlichen Tibber-API-Token.

1. Erstellen Sie einen Token im [Tibber Developer Portal](https://tibber.com).
2. Tragen Sie diesen in der HCUweb-Oberfläche unter den Plugin-Einstellungen als Umgebungsvariable ein:
   - **Name:** `TIBBER_TOKEN`
   - **Wert:** `DEIN_PERSÖNLICHER_TIBBER_TOKEN`

## Lizenz

Mit 💙 für die Smart-Home-Community veröffentlicht unter der MIT-Lizenz.
