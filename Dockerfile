FROM node:17-alpine

ARG NODE_ENV=production
ENV NODE_ENV $NODE_ENV

RUN apk add git python3 build-base
RUN npm i -g pnpm

RUN apk add git
RUN npm i -g pnpm

COPY package.json .
RUN NODE_ENV=development pnpm i

COPY . .
RUN NODE_ENV=development pnpm i
RUN pnpm build

CMD ["node", "build"]
