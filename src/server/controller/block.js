import Router from 'koa-router'
import rp from 'request-promise'
import mountController from '../middlewares/mountController'

import config from '../../../config'

const parityAddress = config.parityAddress
const router = new Router()

const getList = (list) => {
  list.forEach(l => {
    l['@rid'] = undefined
    l['@class'] = undefined
    l['@version'] = undefined
    l['@type'] = undefined
  })
  return list
}
const getPageInfo = ({ pageNum, pageSize }) => ({
  pageNum: pageNum ? +pageNum : 1,
  pageSize: pageSize ? +pageSize : 50
})

router.get('/', mountController(async (params, query, body, context) => {
  const { pageNum, pageSize } = getPageInfo(query)
  const total = await context.db.query(
    `select count(*) from Block`
  )
  const data = await context.db.query(
    `SELECT * 
      FROM Block 
      ORDER BY @rid DESC SKIP ${pageSize * (pageNum - 1)} limit ${pageSize}`
  )
  return {
    data: {
      list: getList(data),
      pageNum: pageNum,
      total: total[0].count
    }
  }
}))

const sleep = ms => {
  return new Promise(resolve => setTimeout(resolve, ms))
}
router.get('/byRange', mountController(async (params, query, body, context) => {
  let { start, end } = query
  start = +start
  end = end ? +end : end
  const condition = `blockNumber >= ${start} ` + (end ? `AND blockNumber <= ${end}` : '')
  let blockNumbers = []
  try {
    blockNumbers = await Promise.all([rp({
      method: 'POST',
      uri: parityAddress,
      body: {
        method: 'eth_blockNumber',
        params: [],
        id: 1,
        jsonrpc: '2.0'
      },
      json: true
    }), context.db.query(
      `SELECT * 
        FROM Block 
        ORDER BY blockNumber DESC limit 1`
    )])
  } catch (e) {
    console.log(e)
  }
  if (blockNumbers.length &&
    (blockNumbers[0] > blockNumbers[1][0].blockNumber)
  ) {
    await (sleep(5000))
  }
  const data = await context.db.query(
    `SELECT * 
      FROM Block 
      WHERE ${condition}
      ORDER BY blockNumber DESC`
  )
  return {
    data: {
      list: getList(data)
    }
  }
}))

const getBlockCondition = blockId => (String(blockId).indexOf('0x') !== -1
  ? `blockHash = '${blockId}'`
  : `blockNumber = ${blockId}`)

router.get('/:blockId', mountController(async (params, query, body, context) => {
  const { blockId } = params
  const condition = getBlockCondition(blockId)
  const data = await context.db.query(
    `SELECT *
      FROM Block 
      WHERE ${condition} limit 1`
  )
  return {
    data: getList(data)[0]
  }
}))

router.get('/:blockId/transaction', mountController(async (params, query, body, context) => {
  const { blockId } = params
  const { pageNum, pageSize } = getPageInfo(query)
  const condition = getBlockCondition(blockId)
  const data = await Promise.all([context.db.query(
    `select *, 
      in.address as fromAddress,
      out.address as toAddress from Transaction 
      where ${condition} and traceAddress=[]
      SKIP ${pageSize * (pageNum - 1)} limit ${pageSize}`
  ), context.db.query(
    `select count(*) from Transaction 
      where ${condition} and traceAddress=[]`
  )]).then(values => ({
    list: getList(values[0]),
    pageNum,
    total: values[1][0].count
  }))
  return {
    data
  }
}))

const getIntTransCondition = blockId => (
  `${getBlockCondition(blockId)} and traceAddress!=[]`
)

router.get('/:blockId/intTrans', mountController(async (params, query, body, context) => {
  const { blockId } = params
  const condition = getIntTransCondition(blockId)
  const { pageNum, pageSize } = getPageInfo(query)
  const data = await Promise.all([context.db.query(
    `select *, 
      in.address as fromAddress,
      out.address as toAddress from Transaction 
      where ${condition}
      SKIP ${pageSize * (pageNum - 1)} limit ${pageSize}`
  ), context.db.query(
    `select count(*) from Transaction 
      where ${condition} and traceAddress!=[]`
  )]).then(values => ({
    list: getList(values[0]),
    pageNum,
    total: values[1][0].count
  }))
  return {
    data
  }
}))

export default router
