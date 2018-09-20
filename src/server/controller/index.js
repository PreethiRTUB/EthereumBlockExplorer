import Router from 'koa-router'

import external from './external'
import block from './block'
import address from './address'
import transaction from './transaction'
import analysis from './analysis'

const router = new Router()

router.use('/external', external.routes())

router.use('/block', block.routes())

router.use('/address', address.routes())

router.use('/transaction', transaction.routes())

router.use('/analysis', analysis.routes())

module.exports = router
