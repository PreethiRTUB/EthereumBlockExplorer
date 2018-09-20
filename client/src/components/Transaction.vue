<template>
  <div class="page-content">
    <div class="row">
      <div class="topMargin blockInfo">
        <b-card title="Transaction Information"
                    :sub-title=transactionHash>
                    <p><strong>From Address:</strong> {{ fromAddress }} ||  <strong>To Address:</strong>  {{ toAddress }}</p>
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
        </b-table>
      </div>
      <FraudChart :transHashList='lables' :dataset='dataset' ></FraudChart>
    </div>
    <!-- modals -->
  </div>
</template>

<script>
import Chart from './Chart.vue'

export default {
  name: 'Transaction',
  components: {
    'FraudChart': Chart
  },
  data () {
    return {
      title: 'Transaction',
      name: '',
      transFields: [ 'transactionHash', 'type', 'result' ],
      fromAddress: '',
      toAddress: '',
      transactionHash: '',
      transactionList: [],
      lables: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
      dataset: [12, 19, 3, 5, 2, 3]
    }
  },
  mounted () {
    this.$notifyInfo('Fetching data')
  },
  async created () {
    try {
      this.transactionHash = this.$router.history.current.fullPath.split('/')[2]
      const res = await this.$backendCli.getTransactionById(this.transactionHash)
      this.fromAddress = res.data.data.fromAddress
      this.toAddress = res.data.data.toAddress
    } catch (e) {
      this.$notifyError(e)
    }
    try {
      const translst = await this.$backendCli.getInternalTransaction(this.transactionHash)
      if (translst.data.data.length === 0) {
        this.$notifyError('No Records found')
      } else {
        console.log(translst)
        this.transactionList = translst.data.data.list
      }
    } catch (e) {
      this.$notifyError(e)
    }
  },
  methods: {
  }
}
</script>
<style src='../assets/css/common.css'>
</style>
