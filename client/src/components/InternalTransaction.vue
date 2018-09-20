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
        <b-table striped hover :items='intTransactionHash' :fields='transFields'>
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
      title: 'Internal Transaction',
      name: '',
      transFields: [ 'intTransactionHash', 'type', 'result' ],
      fromAddress: '',
      toAddress: '',
      intTransactionHash: '',
      transactionList: [],
      lables: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
      dataset: [12, 19, 3, 5, 2, 3]
    }
  },
  async created () {
    try {
      this.intTransactionHash = this.$router.history.current.fullPath.split('/')[2]
      const res = await this.$backendCli.getTransactionById(this.transactionHash)
      console.log(res)
      this.fromAddress = res.data.data.fromAddress
      this.toAddress = res.data.data.toAddress

      const translst = await this.$backendCli.getInternalTransaction(this.transactionHash)
      console.log(translst)
      this.transactionList = translst.data.data.list
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
