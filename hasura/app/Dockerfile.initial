FROM node:17-alpine
ARG NODE_ENV=production
ENV NODE_ENV $NODE_ENV

RUN apk add git ffmpeg python3 build-base vips-dev
RUN npm i -g pnpm

WORKDIR /app
COPY . ./

RUN pnpm install

# CMD ["sleep", "3600"]
CMD ["pnpm", "start"]
