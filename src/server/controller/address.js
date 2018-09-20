import Router from 'koa-router'
import _ from 'lodash'
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
};

const getPageInfo = ({ pageNum, pageSize }) => ({
  pageNum: pageNum ? +pageNum : 1,
  pageSize: pageSize ? +pageSize : 50
})

router.get('/:hash/transaction', mountController(async (params, query, body, context) => {
  const { hash } = params
  const { pageNum, pageSize } = getPageInfo(query)
  const condition = `address = '${hash}'`
  const transactionHash = await context.db.query(
    `
      SELECT bothe('Transaction').transactionHash 
        from Address 
        where ${condition}
        limit 1
    `
    )
  const t = _.flatten(transactionHash.map(r => r.bothe))
  const data = await context.db.query(
    `
      select *, in.address as toAddress, out.address as fromAddress 
        from Transaction 
        where transactionHash in 
          ${JSON.stringify(t)}
        and traceAddress=[]
        SKIP ${pageSize * (pageNum - 1)} limit ${pageSize}

    `
  )
  return {
    data: {
      list: getList(data),
      pageNum,      
    }
  }
}))

router.get('/:hash/intTrans', mountController(async (params, query, body, context) => {
  const { hash } = params
  const { pageNum, pageSize } = getPageInfo(query)
  const condition = `address = '${hash}'`
  const transactionHash = await context.db.query(
    `
      SELECT bothe('Transaction').transactionHash 
        from Address 
        where ${condition}
        limit 1
    `
    )
  const t = _.flatten(transactionHash.map(r => r.bothe))
  const data = await context.db.query(
    `
      select *, in.address as toAddress, out.address as fromAddress 
        from Transaction 
        where transactionHash in 
          ${JSON.stringify(t)}
        and traceAddress!=[]
        SKIP ${pageSize * (pageNum - 1)} limit ${pageSize}

    `
  )
  return {
    data: {
      list: getList(data),
      pageNum,      
    }
  }  
}))


router.get('/accounts', mountController(async (params, query, body, context) => {
  const { pageNum, pageSize } = getPageInfo(query);
  const data = await Promise.all([context.db.query(
    `
        SELECT address
         FROM Address
        SKIP ${50 * ((pageNum || 1) - 1)} limit ${pageSize}

    `
  ), context.db.query(
    `
      SELECT count(*) 
        FROM Address
    `
  )]).then(values => ({
    list: getList(values[0]),
    pageNum: +(pageNum || 1),
    total: values[1][0].count
  }));
  return {
    data: data
  }
}));

router.get('/contracts', mountController(async (params, query, body, context) => {
  const { pageNum, pageSize } = getPageInfo(query);
  const data = await Promise.all([context.db.query(
    `
        SELECT address,blockHash,blockNumber,transactionHash,traceAddress,type,gas,value,code
         FROM Contract
        SKIP ${50 * ((pageNum || 1) - 1)} limit ${pageSize}

    `
  ), context.db.query(
    `
      SELECT count(*) 
        FROM Contract
    `
  )]).then(values => ({
    list: getList(values[0]),
    pageNum: +(pageNum || 1),
    total: values[1][0].count
  }));
  return {
    data: data
  }
}));

router.get('/contracts/:hash/transactions', mountController(async (params, query, body, context) => {
  const { hash } = params;
  const { pageNum, pageSize } = getPageInfo(query);
  const condition = `address = '${hash}'`;
  const transactionHash = await context.db.query(
    `
      SELECT bothe('TokenTransfer').transactionHash
        from Contract 
        where ${condition}
        limit 1
    `
    )
  console.log(transactionHash)
  const t = _.flatten(transactionHash.map(r => r.bothe))
  const data = await context.db.query(
    `
        select *, in.address as toAddress, out.address as fromAddress 
        from Transaction 
        where transactionHash in 
          ${JSON.stringify(t)}
        and traceAddress=[]        
        SKIP ${pageSize * (pageNum - 1)} limit ${pageSize}

    `
  )
  return {
    data: {
      list: getList(data),
      pageNum,      
    }
  }   
}));

router.get('/contracts/:hash/intTrans', mountController(async (params, query, body, context) => {
  const { hash } = params;
  const { pageNum, pageSize } = getPageInfo(query);
  const condition = `address = '${hash}'`;
  const transactionHash = await context.db.query(
    `
      SELECT bothe('TokenTransfer').transactionHash
        from Contract 
        where ${condition}
        limit 1
    `
    )
  console.log(transactionHash)
  const t = _.flatten(transactionHash.map(r => r.bothe))
  const data = await context.db.query(
    `
        select *, in.address as toAddress, out.address as fromAddress 
        from Transaction 
        where transactionHash in 
          ${JSON.stringify(t)}
        and traceAddress!=[]        
        SKIP ${pageSize * (pageNum - 1)} limit ${pageSize}

    `
  )
  return {
    data: {
      list: getList(data),
      pageNum,      
    }
  } 
}));

export default router
