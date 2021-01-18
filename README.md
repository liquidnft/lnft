# Liquid Art

## Dependencies

Docker: https://docs.docker.com/get-docker/
Hasura CLI: https://hasura.io/docs/1.0/graphql/core/hasura-cli/install-hasura-cli.html#install-hasura-cli

## Developing Locally

    git clone https://gogs.coinos.io/adam/liquidart
    yarn
    yarn dev
    cd hasura
    cp .env.sample .env
    docker-compose up -d
    hasura migrate apply
    hasura metadata apply
