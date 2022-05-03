FROM gcr.io/coinos-326717/github.com/tokenocean/raretoshi:base

ARG NODE_ENV=production
ENV NODE_ENV $NODE_ENV

WORKDIR /app
COPY . .
RUN pnpm build

CMD ["node", "build"]
