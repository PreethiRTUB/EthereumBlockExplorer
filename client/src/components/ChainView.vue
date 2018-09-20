<template>
  <div class="page-content">
    <div class="row">
      <div class="col-md-6 routeTitle">
        <h2>{{ title }}</h2>
      </div>
      <div class="col-md-6 routeTitle">
        <p>Total Number of Blocks are {{totalBlocks}}</p>
      </div>
    </div>
    <div class="row">
      <div class="col-md-12">
        <b-table striped hover :items='chain' :fields='fields'>
          <template slot="blockNumber" slot-scope="data">
            <a :href="`/block/${data.value}`">
              {{data.value}}
            </a>
          </template>
          <template slot="blockHash" slot-scope="data">
            <a :href="`/block/${data.value}`">
              {{data.value}}
            </a>
          </template>
        </b-table>
      </div>
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
  name: 'ChainVue',
  components: {
    'FraudChart': Chart
  },
  data () {
    return {
      title: 'Ethereum Chain',
      name: '',
      fields: ['blockNumber', 'blockHash'],
      chain: [],
      lables: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
      dataset: [12, 19, 3, 5, 2, 3],
      totalBlocks: 1,
      pageNum: 1
    }
  },
  async created () {
    try {
      const resp = await this.$backendCli.getBlocks(1)
      this.chain = resp.data.data.list
      this.totalBlocks = resp.data.data.total
    } catch (e) {
      this.$notifyError(e)
    }
  },
  mounted () {
    this.$notifyInfo('Fetching data')
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

<style>
.routeTitle{
  margin-top: 70px;
  margin-bottom: 10px;
  position: relative;
  width: 100%;
  height: 50px;
  z-index: 99;
  text-align: center;
}
.pageList{
  margin: auto
}
</style>
