FROM node:14-alpine
ARG NODE_ENV=production
ENV NODE_ENV $NODE_ENV

WORKDIR /app

COPY . ./
RUN apk add git
RUN yarn install

# CMD ["sleep", "3600"]
CMD ["yarn", "start"]
