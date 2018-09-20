const OrientDB = require('orientjs')

exports.connect = (host = 'explorer.snet.tu-berlin.de', port = 2424, username = 'root', password = 'eith8saevee4eituLuro') => {
  return OrientDB({
    host,
    port,
    username,
    password
  })
}

exports.create = (dbconn, name, type = 'graph', storage = 'plocal') => {
  return dbconn.create({
    name,
    type,
    storage
  })
    .then(database => {
      console.info(`Database: ${database.name} created successfully`)
    })
    .catch(err => {
      console.error('Database: create database error', err)
    })
}

exports.getDB = (dbconn, name = 'EthereumFraudExplorer', username = 'root', password = 'eith8saevee4eituLuro') => {
  return dbconn.use({
    name,
    username,
    password
  })
}

exports.close = dbconn => dbconn.close()
