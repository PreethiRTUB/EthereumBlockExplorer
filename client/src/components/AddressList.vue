<template>
  <div class="page-content">
    <div class="row">
      <div class="col-md-6 routeTitle">
        <h2>{{ view }}{{ title }}</h2>
      </div>
       <div class="col-md-6 routeTitle">
        <p>Total Number of {{ view }} are {{totalBlocks}}</p>
      </div>
    </div>
    <div class="row">
      <div class="col-md-6">
        <b-table striped hover :items='chain' :fields='fields'>
          <template slot="address" slot-scope="data">
            <a v-if="view==='accounts'" :href="`/address/${data.value}`">
              {{data.value}}
            </a>
             <a v-else :href="`/address/contracts/${data.value}`">
              {{data.value}}
            </a>
          </template>
        </b-table>
      </div>
      <FraudChart :transHashList='lables' :dataset='dataset' ></FraudChart>
    </div>
    <div class="row">
      <div class="pageList">
        <b-pagination :total-rows="totalBlocks" v-model="pageNum" :per-page="50" v-on:change="getNextPage">
        </b-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import Chart from './Chart.vue'
export default {
  name: 'AddressListView',
  components: {
    'FraudChart': Chart
  },
  data () {
    return {
      view: this.$router.history.current.fullPath.split('/')[2],
      address: 'address',
      title: ' list',
      name: '',
      fields: [ 'address' ],
      chain: [],
      modalErrorMessage: '',
      lables: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
      dataset: [12, 19, 3, 5, 2, 3]
    }
  },
  mounted () {
    this.$notifyInfo('Fetching data')
  },
  async created () {
    try {
      if (this.view === 'accounts') {
        const resp = await this.$backendCli.getListAccounts()
        this.chain = resp.data.data.list
        this.totalBlocks = resp.data.data.total
      } else if (this.view === 'contracts') {
        const resp = await this.$backendCli.getListContract()
        this.chain = resp.data.data.list
        this.totalBlocks = resp.data.data.total
      }
    } catch (e) {
      this.$notifyError(e)
    }
  },
  methods: {
    async getNextPage () {
      try {
        this.pageNum = this.pageNum + 1
        const resp = await this.$backendCli.getBlocks(this.pageNum)
        this.chain = resp.data.data.list
      } catch (e) {
        this.$notifyError(e)
      }
    }
  }
}

</script>

<style src='../assets/css/common.css'>
</style>
