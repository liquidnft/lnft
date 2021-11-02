FROM node:alpine

RUN apk add git python3 vim iputils build-base vips-dev
RUN npm i -g pnpm
WORKDIR /app
COPY . /app
RUN pnpm i
RUN pnpm build
RUN cat build/middlewares.js >> shim.js
RUN mv shim.js build/middlewares.js
CMD ["node", "build"]
