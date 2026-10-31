FROM node:22-alpine

WORKDIR /app

ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=4173

COPY package.json server.js index.html ./
COPY tools ./tools
COPY shared ./shared
COPY admin ./admin
COPY assets ./assets
COPY voyage ./voyage

EXPOSE 4173

CMD ["node", "server.js"]
