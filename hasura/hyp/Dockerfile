FROM node:14-buster

WORKDIR /app

COPY . ./
RUN apt-get update
RUN apt-get install git libtool build-essential python3 autoconf automake -y
RUN rm -rf node_modules
RUN yarn install
RUN yarn add nodemon
RUN yarn global add @hyperspace/cli

# CMD ["sleep", "3600"]
CMD ["yarn", "start"]
