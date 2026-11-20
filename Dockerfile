# One container: Express backend + the static frontend (index.html, styles.css, app.js)
FROM node:20-slim

WORKDIR /app
ENV NODE_ENV=production

COPY backend/package*.json ./
RUN npm install --omit=dev

COPY backend/ ./
COPY index.html styles.css app.js ./public/
ENV STATIC_DIR=/app/public

# Cloud Run sends traffic to $PORT (8080 by default)
EXPOSE 8080
USER node
CMD ["node", "server.js"]
