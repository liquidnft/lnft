FROM node:14-alpine
ARG NODE_ENV=production
ENV NODE_ENV $NODE_ENV

WORKDIR /app

COPY . ./
RUN apk add git libtool build-base python3 autoconf automake libsodium
RUN yarn install
RUN yarn add nodemon

# CMD ["sleep", "3600"]
CMD ["yarn", "start"]
