FROM node:24-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY manifest.json ./
COPY src/ ./src/
CMD ["node", "src/index.js"]
