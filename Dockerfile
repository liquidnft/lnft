FROM node:14-alpine
ARG NODE_ENV=production
ENV NODE_ENV $NODE_ENV
ENV PORT 3010

WORKDIR /app

EXPOSE $PORT
CMD ["yarn", "start"]
