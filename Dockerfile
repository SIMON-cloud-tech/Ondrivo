# ── Base image ──
FROM node:22-alpine
# ── Set working directory ──
WORKDIR /app

# ── Copy root package.json (for concurrently, if any) ──
COPY package*.json ./
RUN npm install || true

# ── BACKEND ──
COPY server/ ./server/
WORKDIR /app/server
RUN npm install

# ── FRONTEND ──
WORKDIR /app
COPY client/ ./client/
WORKDIR /app/client
RUN npm install && npm run build

# ── Move built frontend to backend's static folder ──
WORKDIR /app
RUN mkdir -p ./server/public
RUN cp -r ./client/dist/* ./server/public/

# ── Expose port ──
EXPOSE 5000

#copy backend/data
COPY server/data/ ./server/data/
# ── Start backend ──
WORKDIR /app/server
CMD ["node", "server.js"]