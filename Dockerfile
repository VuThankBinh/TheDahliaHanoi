FROM node:22-alpine

WORKDIR /app

ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=4173

COPY package.json package-lock.json ./
RUN npm ci --omit=dev
COPY server.js index.html ./
COPY tools ./tools
COPY shared ./shared
COPY admin ./admin
COPY assets ./assets
COPY wwwroot ./wwwroot
RUN node tools/compress-images.js

EXPOSE 4173

CMD ["sh", "-c", "node tools/compress-images.js; exec node server.js"]
