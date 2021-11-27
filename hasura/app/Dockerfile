FROM node:alpine

ARG NODE_ENV=production
ENV NODE_ENV $NODE_ENV
ENV NODE_OPTIONS --openssl-legacy-provider

RUN apk add git ffmpeg python3 build-base vips-dev
RUN npm i -g pnpm

WORKDIR /app

COPY package.json .
RUN pnpm i

COPY . .

CMD ["pnpm", "start"]
