FROM node:alpine

WORKDIR /app
COPY . /app
RUN apk add git
RUN npm i -g pnpm
RUN pnpm i
RUN pnpm build
RUN cat build/middlewares.js >> shim.js
RUN mv shim.js build/middlewares.js

CMD ["node", "build"]
