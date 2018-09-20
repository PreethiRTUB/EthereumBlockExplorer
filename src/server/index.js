import Koa from 'koa'
import uuid from 'uuid/v1'
import bodyParser from 'koa-bodyparser'
import cors from 'kcors'

import logger from './utils/logger'
import actionLogger from './utils/actionLogger'
import routers from './controller'

import config from '../../config'
import database from './db'

import Importer from './daemons/parity-importer'

const PORT = config.port
var dbconn = database.connect()
var db = database.getDB(dbconn)
const daemon = new Importer(db)

const app = new Koa()

app.use(async (context, next) => {
  const start = Date.now()
  dbconn = database.connect()
  db = database.getDB(dbconn)
  context.db = db
  context.logger = logger.child({
    traceId: uuid()
  })
  context.actionLogger = actionLogger.child({
    recordTime: Date.now()
  })
  logger.child({ verbose: context.request.method, url: context.url }).info()
  
  
  try {
    await next()
    logger.child({ cost: Date.now() - start, url: context.url }).info()
  } catch (e) {
    logger.child({ cost: Date.now() - start, url: context.url }).error(e)
  }
})

app.use(bodyParser({
  jsonLimit: '4mb'
}))

app.use(cors({ origin: ctx => ctx.request.headers.origin, keepHeadersOnError: true, credentials: true }))
app.use(routers.routes()).use(routers.allowedMethods())
app.listen(PORT)

logger.info(`server is up at ${PORT}`)
logger.info(`importer is ${daemon.isActive() ? '' : 'not '}running`)
