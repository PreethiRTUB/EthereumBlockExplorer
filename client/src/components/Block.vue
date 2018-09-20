<template>
  <div class="page-content">
    <div class="row">
      <div class="topMargin blockInfo">
          <b-card title="Block Information"
                  :sub-title=blockHash>
                  <p><strong>Block Number:</strong>  {{ blockId }}</p>
                  <p><strong>From Address:</strong> {{ from }} ||  <strong>To Address:</strong>  {{ to }}</p>
                   <b-button size="lg" variant="outline-success" v-on:click='getInterTransacList'>
                  {{ showingIntTrans ? 'Hide' : 'Show'}} Internal transaction
              </b-button>
          </b-card>
      </div>
    </div>
    <div class="row">
      <div class="col-md-7">
        <b-table striped hover :items='transactionList' :fields='transFields'>
          <template slot="transactionHash" slot-scope="data">
            <a :href="`/transaction/${data.value}`">
              {{data.value}}
            </a>
          </template>
          <template slot="show_details" slot-scope="row">
      <!-- we use @click.stop here to prevent emitting of a 'row-clicked' event  -->
            <b-button size="sm" @click.stop="row.toggleDetails" class="mr-2">
            {{ row.detailsShowing ? 'Hide' : 'Show'}} Details
            </b-button>
          </template>
          <template slot="row-details" slot-scope="row">
            <b-card>
              <b-row class="mb-2">
                <b-col sm="3" class="text-sm-right"><b>Gas Used:</b></b-col>
                <b-col>{{ row.item.gasUsed }}</b-col>
                </b-row>
                <b-row class="mb-2">
                 <b-col sm="3" class="text-sm-right"><b>Input:</b></b-col>
                <b-col>{{ row.item.input }}</b-col>
                </b-row>
               <b-row class="mb-2">
                <b-col sm="3" class="text-sm-right"><b>In Value:</b></b-col>
                <b-col>{{ row.item.in }}</b-col>
                 <b-col sm="3" class="text-sm-right"><b>Out Value:</b></b-col>
                <b-col>{{ row.item.out }}</b-col>
              </b-row>
              <b-row class="mb-2">
                <b-col sm="3" class="text-sm-right"><b>Gas</b></b-col>
                <b-col>{{ row.item.gas }}</b-col>
                <b-col sm="3" class="text-sm-right"><b>Value</b></b-col>
                <b-col>{{ row.item.value }}</b-col>
              </b-row>
              <b-button size="sm" @click="row.toggleDetails">Hide Details</b-button>
            </b-card>
          </template>
        </b-table>
      </div>
      <div class="col-md-5 chart">
        <FraudChart v-bind:transHashList="lables" v-bind:dataset="dataset" ></FraudChart>
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
  name: 'Block',
  components: {
    'FraudChart': Chart
  },
  data () {
    return {
      title: 'Block',
      transFields: [ 'transactionHash', 'type', 'show_details' ],
      transactionList: [],
      modalErrorMessage: '',
      blockId: this.$router.history.current.fullPath.split('/')[2],
      blockNumber: '',
      blockHash: '',
      from: '',
      to: '',
      lables: [],
      dataset: [],
      totalTrans: 1000,
      pageNum: 1,
      intTransListPageNum: 1,
      transListPageNum: 1,
      showingIntTrans: false
    }
  },
  async mounted () {
    this.$notifyInfo('Fetching data')
    try {
      const res = await this.$backendCli.getBlockById(this.$router.history.current.fullPath.split('/')[2])
      this.blockNumber = res.data.data.blockNumber
      this.blockHash = res.data.data.blockHash
      this.from = res.data.data.action.from
      this.to = res.data.data.action.to
    } catch (e) {
      this.$notifyError(e)
    }
    this.getTransacList()
  },
  methods: {
    async getNextPage () {
      if (!this.showingIntTrans) {
        this.getTransacList()
      } else if (this.showingIntTrans) {
        this.getInterTransacList()
      }
    },
    async getInterTransacList () {
      if (this.showingIntTrans) {
        this.$set(this.showingIntTrans, '0', false)
        this.getTransacList()
        return
      }
      try {
        const translst = await this.$backendCli.getlistIntTrans(this.blockHash, this.transListPageNum)
        this.transactionList = translst.data.data.list
        this.transListPageNum = this.transListPageNum + 1
        let dataArray = []
        let valueArray = []
        // let inArray = []
        // let outArray = []
        let transID = []
        this.transactionList.forEach(function (ele, index) {
          // inArray.push(ele.in.substr(1).replace(':', '.'))
          // outArray.push(ele.out.substr(1).replace(':', '.'))
          valueArray.push(ele.value/ 1000000000000000000)
          transID.push(index)
        })
        // dataArray.push(inArray)
        // dataArray.push(outArray)
        dataArray.push(valueArray)
        this.$set(this.dataset, '1', dataArray)
        this.$set(this.lables, '2', transID)
        this.$set(this.showingIntTrans, '0', true)
      } catch (e) {
        this.$notifyError(e)
      }
    },
    async getTransacList () {
      try {
        const translst = await this.$backendCli.getlistTransactions(this.blockHash, this.intTransListPageNum)
        this.transactionList = translst.data.data.list
        this.intTransListPageNum = this.intTransListPageNum + 1
        let dataArray = []
         let valueArray = []
        // let inArray = []
        // let outArray = []
        let transID = []
        this.transactionList.forEach(function (ele, index) {
          // inArray.push(ele.in.substr(1).replace(':', '.'))
          // outArray.push(ele.out.substr(1).replace(':', '.'))
          valueArray.push(Math.abs(ele.value)/ 1000000000000000000)
          transID.push(index)
        })
        // dataArray.push(inArray)
        // dataArray.push(outArray)
        dataArray.push(valueArray)
        this.$set(this.dataset, '1', dataArray)
        this.$set(this.lables, '2', transID)
      } catch (e) {
        this.$notifyError(e)
      }
    }
  }
}
</script>

<style src='../assets/css/common.css'>
</style>
