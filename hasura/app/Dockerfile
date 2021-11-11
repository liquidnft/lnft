FROM asoltys/lnft-server
ARG NODE_ENV=production
ENV NODE_ENV $NODE_ENV

WORKDIR /app
COPY . ./

RUN pnpm install

CMD ["pnpm", "start"]
