# Music NFT
This application is developed for this [Filecoin devgrant](https://github.com/filecoin-project/devgrants/pull/240/files).

## Description
To echo "Not on IPFS, not your NFT", this platform allows NFT music artist to store their work on filecoin network. 

Each piece of art will have a unique and immutable IPFS address, to prevent rug pull event like [this](https://twitter.com/neitherconfirm/status/1369285946198396928).

This portal will allow artist login using multiple social logins, and allow them to upload and manage their music art work.

Anonymous visitors can browse / search the NFT catalog and play the music.

## Requirements
mn-frontend is a Vue v3 web application. mn-server is a Koa v2 nodejs application.

The whole system has the following dependencies:
1. NodeJS (yarn is recommended to install dependencies)
2. MongoDB
3. IPFS daemon
4. A firebase application to allow social login

## Deployment
1. Make sure MongoDB and IPFS daemon are running.
2. Run `yarn install` (or `npm install`) inside both mn-frontend and mn-server folder.
3. Edit the `.env` file in mn-frontend for your planned mn-server URL prefix as well as Firebase credentials. The default port for mn-frontend is 8088.
4. Run `yarn install` in mn-frontend to install nodejs dependencies.
5. Run `yarn dev` in mn-frontend to start the frontend application.
6. Edit the `.env` file in mn-server for your MongoDB and IPFS connection information. The default port for mn-server is 3000.
7. Run `yarn install` in mn-server to install nodejs dependencies.
8. Run `yarn dev` in mn-server to start the backend application.

## License
MIT license

## Contact
My ID @feiya200 on Filecoin slack.