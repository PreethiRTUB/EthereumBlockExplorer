const config = {
  host: '127.0.0.1',
  port: 3000,
  serverName: 'https://explorer.snet.tu-berlin.de/',
  log: {
    path: 'logs/explorer',
    level: 'debug'
  },
  actionLog: {
    path: 'logs/events',
    level: 'debug'
  },
  parityAddress: 'http://130.149.223.150:8545/',
  importInterval: 5000
}

export default config
