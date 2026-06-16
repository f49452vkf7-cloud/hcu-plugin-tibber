FROM node:24-alpine
WORKDIR /app
COPY package*.json ./
# Umgestellt auf stabilen install-Befehl ohne Lockfile-Zwang
RUN npm install --omit=dev
COPY manifest.json ./
COPY src/ ./src/
CMD ["node", "src/index.js"]
