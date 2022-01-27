# LNFT

LNFT is a web-based platform for issuing and transacting with non-fungible tokens on the [Bitcoin Liquid Network](https://blockstream.com/liquid/). Blockstream is sponsoring its development and hosting an exemplary curated instance of it for use by Bitcoin artists at [Raretoshi](https://raretoshi.com). 

The plan is to separate out any Raretoshi-specific features from the core platform functionality so that anyone can adapt the platform to host their own Liquid-based NFT site but that's currently a work in progress

## Features

 - User accounts and profiles for artists and collectors include custom avatars, contact info and biography
 - Users can follow other artists and collectors and like/favorite individual artworks
 - Artists can upload digital media files (jpg, png, gif, mp4) representing an artwork and add metadata like a title, description, and tags
 - Selected metadata is published in the [liquid asset registry](https://docs.blockstream.com/liquid/developer-guide/proof-of-issuance.html) so that tokens can be recognized by external wallets
 - Media files are added to the IPFS network upon being uploaded and are given a unique content identifier (CID) derived from the SHA256 hash of the file
 - The CID is embedded in the Liquid token issuance transaction contract, permanently and provably linking the file to the token
 - Artworks are listed in a searchable/sortable/filterable marketplace gallery
 - Artists can list an artwork for sale by setting an optional listing price, royalty rate, and/or auction period
 - Bids and sales are conducted peer-to-peer using atomic swaps so the platform host does not need to escrow funds
 - Listings, bids, transfers and new artwork activity are logged and presented in a site-wide feed
 - A web-based liquid wallet is integrated into the user's profile page and allows them to fund their accounts with L-BTC or any kind of liquid asset
 - Wallets can be backed up and imported using a 12-word BIP mnemonic seed phrase
 - Built-in integration with the [coinos.io](https://coinos.io) API allows users to instantly convert BTC to L-BTC by depositing to an on-chain address or paying a lightning network invoice
 - Royalties and auction holding periods are enforced through a 2-of-2 signing server that only signs off on transactions that meet certain conditions

## Tech stack summary

### Front-end

 - [Svelte Kit](https://github.com/sveltejs/kit) reactive component framework
 - [Tailwind CSS](https://tailwindcss.com/) UI utility classes
 - [LiquidJS](https://github.com/vulpemventures/liquidjs-lib) for liquid wallet functionality

### Back-end

 - [Postgres/Hasura](https://hasura.io) for storing relational app data
 - [Hasura backend plus](https://github.com/nhost/hasura-backend-plus) for JWT-based user auth
 - [IPFS](https://ipfs.io) for media storage and hash-based content addressing
 - [Fastify](https://www.fastify.io/) NodeJS api/app server

### 3rd-party APIs:

 - [Esplora](https://github.com/Blockstream/esplora/blob/master/API.md) for Liquid blockchain data
 - [Liquid asset registry](https://docs.blockstream.com/liquid/developer-guide/proof-of-issuance.html) for token metadata
 - [coinos](https://coinos.io/) BTC/LNBTC <-> L-BTC conversion

## Installation pre-requisites

 - pnpm: https://pnpm.io/
 - Docker: https://docs.docker.com/get-docker/
 - Hasura CLI: https://hasura.io/docs/1.0/graphql/core/hasura-cli/install-hasura-cli.html#install-hasura-cli

## Setup local development environment

    git clone https://github.com/liquidnft/lnft
    cd lnft
    pnpm install
    cd hasura
    cp .env.sample .env
    docker run -it -v $PWD/app:/app --entrypoint pnpm asoltys/lnft-server install
    docker-compose up -d
    hasura migrate apply
    hasura metadata apply
    hasura seeds apply
    hasura metadata reload
    sudo cp ../static/user.png storage
    docker exec -it ipfs ipfs add /export/user.png
    docker restart lapp
    cd ..
    pnpm dev   # site is available at http://localhost:3000/
    
 ## Setup local development with cloud tools - VS CodeSpaces https://vscode.dev

     npm i -g pnpm
     pnpm install
     curl -L https://github.com/hasura/graphql-engine/raw/stable/cli/get.sh | bash
     cd hasura
     cp .env.sample .env
     docker run -it -v $PWD/app:/app --entrypoint pnpm asoltys/lnft-server install
     docker-compose up -d
     hasura migrate apply
     hasura metadata apply
     hasura seeds apply
     hasura metadata reload
     sudo cp ../static/user.png storage
     docker exec -it ipfs ipfs add /export/user.png
     docker restart lapp
     cd ..
     pnpm dev   # site is available at http://localhost:3000/

## Regtest mining

Mine some blocks to get the electrs API server warmed up

    chmod +x mine.sh
    ./mine.sh   # run in a separate tab

## Fund a wallet with regtest coins

Get a deposit address from the wallet page or users table in the db and send an amount with this command

    docker exec -it liquid elements-cli -datadir=/home/elements/.elements sendtoaddress <address> <amount>
