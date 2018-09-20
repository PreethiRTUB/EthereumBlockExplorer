const config = {
  host: '127.0.0.1',
  port: 3000,
  serverName: '<URL to server>',
  log: {
    path: 'logs/explorer',
    level: 'debug'
  },
  actionLog: {
    path: 'logs/events',
    level: 'debug'
  },
  parityAddress: '<URL to Parity>',
  importInterval: 5000
}

export default config
