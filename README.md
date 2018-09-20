# Block Explorer

> A block explorer Front End to connect to the etherium parity client for visualisation of Etherium chain and possible frauds 

A block explorer using：

- Koa Koa-router backend
- Vue.js frontend
- Database OrientDB

# Installation

```
$ npm install
```
# Before push code -- code style
run `npm run lint` and fix errors if any

# Run locally

Backend and frontend are both started with one command

## Backend & frontend
```bash
# Tunnel parity request through server
sshuttle -r youruser@explorer.snet.tu-berlin.de 130.149.223.150/32

npm install
npm start

```

## Building front-end
```bash

# build for production with minification
npm run build
```

## Prerequsites
* ensure [docker](https://docs.docker.com/glossary/?term=installation) and [docker-compose](https://docs.docker.com/compose/install/) is installed

## Running through docker(Use sudo if asked for permission)
```bash
docker-compose up --build 
```

## Deploy to production
Make sure you have pm2 installed
```
pm2 deploy production
```

## Parity JSONRPC example
Request
```
URL: http://localhost:3000/external/parity
Method: 'POST',
Parameters(see parity documentation): {method: 'trace_block', params: ["0x4C4B40"],id:1, jsonrpc: '2.0' },
```

Response
```
{
  data: {}, //response from parity
  success: true
}
```
