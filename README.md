# Liquid Art

## Pre-reqs

- Yarn: https://yarnpkg.com/
- Docker: https://docs.docker.com/get-docker/
- Hasura CLI: https://hasura.io/docs/1.0/graphql/core/hasura-cli/install-hasura-cli.html#install-hasura-cli

## Install for local dev

    git clone https://gogs.coinos.io/adam/liquidart raretoshi
    cd raretoshi
    yarn
    cd hasura
    cp .env.sample .env
    docker-compose build
    docker-compose up -d
    hasura migrate apply
    hasura metadata apply
    hasura seeds apply
    sudo cp ../static/user.png hasura/storage
    docker exec -it ipfs ipfs add /export/user.png
    cd ..
    yarn dev   # site is available at http://localhost:3000/

## Regtest mining

Mine some blocks to get the electrs API server warmed up

    chmod +x mine.sh
    ./mine.sh   # run in a separate tab

## Fund a wallet

Get a deposit address from the wallet page or users table in the db

    docker exec -it liquid elements-cli -datadir=/config sendtoaddress <address> <amount>

## Build for production

    yarn build
    yarn adapt
