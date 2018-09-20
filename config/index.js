const development = require('./development')

module.exports = {
  development
}[process.env.NODE_ENV ? `${process.env.NODE_ENV}` : 'development']
