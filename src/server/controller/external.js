import Router from 'koa-router'
import mountController from '../middlewares/mountController'
import rp from 'request-promise'

import config from '../../../config'

const parityAddress = config.parityAddress
const router = new Router()

export default router
  .post('/parity', mountController(async (params, query, body, context) => {
    const data = await rp({
      method: 'POST',
      uri: parityAddress,
      body: body,
      json: true
    })
    return { data }
  }))

  .get('/test', mountController(async (params, query, body, context) => {
    const uri = process.env.NODE_ENV === 'development' ? 'http://localhost:3000/external/parity' : 'http://206.81.16.222:3000/external/parity'
    const data = await rp({
      method: 'POST',
      uri,
      body: { method: 'trace_block', params: ['0x4a7680'], id: 1, jsonrpc: '2.0' },
      json: true
    })
    return { data }
  }))
