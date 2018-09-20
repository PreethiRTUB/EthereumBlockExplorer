import Router from 'koa-router'
import mountController from '../middlewares/mountController'

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

router.get('/:transactionHash', mountController(async (params, query, body, context) => {
  const { transactionHash } = params
  const condition = `traceAddress=[] and transactionHash='${transactionHash}'`
  const data = await context.db.query(
    `select * ,
      in.address as fromAddress,
      out.address as toAddress
      from Transaction
      where ${condition} limit 1`
  )
  return {
    data: getList(data)[0]
  }
}))

router.get('/:transactionHash/intTrans', mountController(async (params, query, body, context) => {
  const { transactionHash } = params

  const condition = `traceAddress!=[] and transactionHash='${transactionHash}'`
  const data = await context.db.query(
    `select *, 
      in.address as fromAddress,
      out.address as toAddress from Transaction 
      where ${condition}`
  )
  return {
    data: getList(data)
  }
}))

export default router
