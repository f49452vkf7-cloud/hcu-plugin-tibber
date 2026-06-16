FROM node:24-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --omit=dev
COPY manifest.json ./
COPY src/ ./src/
CMD ["node", "src/index.js"]
