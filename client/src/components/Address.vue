<template>
  <div class="page-content">
     <div class="row">
      <div class="topMargin blockInfo">
          <b-card title="Address Information"
                  :sub-title=blockHash>
                  <p><strong>Score:</strong>  {{ score }}</p>
                   <b-button size="lg" variant="outline-success" v-on:click='getInterTransacList'>
                  {{ showingIntTrans ? 'Hide' : 'Show'}} Internal transaction
              </b-button>
          </b-card>
      </div>
    </div>
    <div class="row">
      <div class="col-md-6">
        <b-table striped hover :items='chain' :fields='fields'>
          <template slot="address" slot-scope="data">
            <a :href="`/account/${data.value}`">
              {{data.value}}
            </a>
          </template>
        </b-table>
      </div>
      <div class="col-md-5 chart">
        <FraudChart :transHashList='lables' :dataset='dataset' ></FraudChart>
      </div>
    </div>
    <div class="row">
      <div class="pageList">
        <b-pagination :total-rows="totalTrans" v-model="pageNum" :per-page="50" v-on:change="getNextPage">
        </b-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import Chart from './Chart.vue'
export default {
  name: 'AddressView',
  components: {
    'FraudChart': Chart
  },
  data () {
    return {
      view: this.$router.history.current.fullPath.split('/')[1],
      title: ' transaction list',
      name: '',
      fields: [ 'address' ],
      chain: [],
      modalErrorMessage: '',
      lables: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
      dataset: [12, 19, 3, 5, 2, 3],
      pageNum: 1,
      score: 0
    }
  },
  mounted () {
    this.$notifyInfo('Fetching data')
  },
  async created () {
    try {
      var id = this.$router.history.current.fullPath.split('/')[2]
      if (this.view === 'account') {
        const resp = await this.$backendCli.getListTransofAddress(id)
        this.chain = resp.data.data.list
      } else {
        const resp = await this.$backendCli.getListTransofContract(id)
        this.chain = resp.data.data.list
      }
    } catch (e) {
      this.$notifyError(e)
    }
     try {
      var id = this.$router.history.current.fullPath.split('/')[2]
      debugger
        const resp = await this.$backendCli.getContractScrore(id)
        
        this.score = resp.data.data.list
      } catch (e) {
      this.$notifyError(e)
    }
  },
  methods: {
     async getNextPage () {
      if (!this.showingIntTrans) {
        this.getTransacList()
      } else if (this.showingIntTrans) {
        this.getInterTransacList()
      }
    }
  }
}

</script>

<style src='../assets/css/common.css'>
</style>
