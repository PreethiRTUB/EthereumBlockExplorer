import axios from 'axios'

const authHeaderName = 'authorization'

function getSession () {
  return JSON.parse(window.sessionStorage.getItem('session'))
}
axios.interceptors.request.use(config => {
  // NProgress.start()
  return config
})

// before a response is returned stop nprogress
axios.interceptors.response.use(response => {
  // NProgress.done()
  return response
})

export function initialize (baseUrl) {
  axios.defaults.baseURL = baseUrl
  let session = getSession()
  if (session) {
    axios.defaults.headers.common[authHeaderName] = session.authHeader
  }
}

export function getBlocks (nextPageNum) {
  return axios.get('/block', {
    params: {
      pageNum: nextPageNum,
      pageSize: 50
    }})
}

export function getBlockById (blockId) {
  return axios.get('/block/' + blockId)
}

export function getAddress (addressId) {
  return axios.get('/address/accounts/' + addressId)
}

export function getTransactionById (transactionId) {
  return axios.get('/transaction/' + transactionId)
}

export function getContractScrore (address) {
  return axios.get('/analysis/' + address)
}

export function getlistTransactions (blockId, nextPageNum) {
  return axios.get('/block/' + blockId + '/transaction', {
    params: {
      pageNum: nextPageNum,
      pageSize: 50
    }})
}
export function getlistIntTrans (blockId, nextPageNum) {
  return axios.get('/block/' + blockId + '/intTrans', {
    params: {
      pageNum: nextPageNum,
      pageSize: 50
    }})
}

export function getInternalTransaction (transactionId, nextPageNum) {
  return axios.get('/transaction/' + transactionId + '/intTrans', {
    params: {
      pageNum: nextPageNum,
      pageSize: 50
    }})
}
export function getListAccounts (nextPageNum) {
  return axios.get('/address/accounts', {
    params: {
      pageNum: nextPageNum,
      pageSize: 50
    }})
}

export function getListTransofAddress (address, nextPageNum) {
  return axios.get('/address/' + address + '/transaction', {
    params: {
      pageNum: nextPageNum,
      pageSize: 50
    }})
}
export function getListIntTransofAddress (address, nextPageNum) {
  return axios.get('/address/' + address + '/intTrans', {
    params: {
      pageNum: nextPageNum,
      pageSize: 50
    }})
}
export function getListContract (nextPageNum) {
  return axios.get('/address/contracts/', {
    params: {
      pageNum: nextPageNum,
      pageSize: 50
    }})
}
export function getListTransofContract (address, nextPageNum) {
  return axios.get('/address/contracts/' + address + '/transaction', {
    params: {
      pageNum: nextPageNum,
      pageSize: 50
    }})
}
export function getListIntTransofContract (address, nextPageNum) {
  return axios.get('/address/contracts/' + address + '/intTrans', {
    params: {
      pageNum: nextPageNum,
      pageSize: 50
    }})
}
