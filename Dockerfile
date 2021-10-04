FROM node:alpine AS builder

WORKDIR /app
COPY . /app
RUN apk add git
RUN yarn
RUN yarn build
RUN cat build/middlewares.js >> shim.js
RUN mv shim.js build/middlewares.js

FROM node:alpine

COPY --from=builder /app /app
WORKDIR /app

CMD ["node", "build"]
