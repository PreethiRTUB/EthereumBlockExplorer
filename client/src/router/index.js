import Vue from 'vue'
import Router from 'vue-router'
import Dashboard from '@/components/ChainView'
import Block from '@/components/Block'
import Transaction from '@/components/Transaction'
import InternalTransaction from '@/components/InternalTransaction'
import AddressList from '@/components/AddressList'
import Address from '@/components/Address'
import PonziScheme from '@/components/Ponzi'
import NProgress from 'nprogress'
import SearchResult from '@/components/SearchResult'

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      name: 'Dashboard',
      component: Dashboard
    },
    {
      path: '/block',
      name: 'Dashboard',
      component: Dashboard
    },
    {
      path: '/search',
      name: 'Search',
      component: SearchResult
    },
    {
      path: '/block/:blockID',
      name: 'Block',
      component: Block
    },
    {
      path: '/block/:blockID/transaction',
      name: 'BlockTransactionList',
      component: Transaction
    },
    {
      path: '/transaction/:transactionId',
      name: 'Transaction',
      component: Transaction
    },
    {
      path: '/transaction/:transactionId/intTrans',
      name: 'InternalTransactionList',
      component: InternalTransaction
    },
    {
      path: '/address/accounts',
      name: 'AddressList',
      component: AddressList
    },
    {
      path: '/address/:address',
      name: 'Address',
      component: Address
    },
    {
      path: '/address/:address/transaction',
      name: 'AddressTransactionList',
      component: Address
    },
    {
      path: '/address/contracts',
      name: 'ContractList',
      component: AddressList
    },
    {
      path: '/contracts/:address',
      name: 'Contract',
      component: Address
    },
    {
      path: '/contracts/:address/transaction',
      name: 'ContractTransactionList',
      component: Address
    },
    {
      path: '/ponzifiles',
      name: 'PonziContractList',
      component: PonziScheme
    }
  ],
  mode: 'history'
})
router.beforeResolve((to, from, next) => {
  // If this isn't an initial page load.
  if (to.name) {
    // Start the route progress bar.
    NProgress.start()
  }
  next()
})

router.afterEach((to, from) => {
  // Complete the animation of the route progress bar.
  NProgress.done()
})

export default router
