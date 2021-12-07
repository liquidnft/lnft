FROM node:17-alpine

ARG NODE_ENV=production
ENV NODE_ENV $NODE_ENV

RUN apk add git
RUN npm i -g pnpm

WORKDIR /app

COPY package.json .
RUN pnpm i

COPY . .
RUN pnpm i
RUN pnpm build

RUN cat build/middlewares.js >> shim.js
RUN mv shim.js build/middlewares.js

CMD ["node", "build"]
