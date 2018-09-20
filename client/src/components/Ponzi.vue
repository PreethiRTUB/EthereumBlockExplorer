<template>
  <div class="page-content">
    <div class="row">
      <div class="col-md-6 routeTitle">
        <h2>{{ title }}</h2>
      </div>
    </div>
    <div class="row">
      <div class="col-md-7">
        <b-table striped hover :items='jsonString' :fields='fields'>
            <template slot="show_details" slot-scope="row">
      <!-- we use @click.stop here to prevent emitting of a 'row-clicked' event  -->
            <b-button size="sm" @click.stop="row.toggleDetails" class="mr-2">
            {{ row.detailsShowing ? 'Hide' : 'Show'}} Details
            </b-button>
          </template>
          <template slot="row-details" slot-scope="row">
            <b-card>
              <b-row class="mb-2">
                <b-col sm="3" class="text-sm-right"><b>Address:</b></b-col>
                <b-col>{{ row.item.Address }}</b-col>
              </b-row>
               <b-row class="mb-2">
                <b-col sm="3" class="text-sm-right"><b>In (Eth):</b></b-col>
                <b-col>{{ row.item.InETH }}</b-col>
                 <b-col sm="3" class="text-sm-right"><b>Out (Eth):</b></b-col>
                <b-col>{{ row.item.OutETH }}</b-col>
              </b-row>
              <b-row class="mb-2">
                <b-col sm="3" class="text-sm-right"><b>In (USD):</b></b-col>
                <b-col>{{ row.item.InUSD }}</b-col>
                 <b-col sm="3" class="text-sm-right"><b>Out (USD):</b></b-col>
                <b-col>{{ row.item.OutUSD }}</b-col>
              </b-row>
              <b-row class="mb-2">
                <b-col sm="3" class="text-sm-right"><b>Paying</b></b-col>
                <b-col>{{ row.item.Paying }}</b-col>
                <b-col sm="3" class="text-sm-right"><b>Paid</b></b-col>
                <b-col>{{ row.item.Paid }}</b-col>
              </b-row>
              <b-row class="mb-2">
                <b-col sm="3" class="text-sm-right"><b>Date First Transaction</b></b-col>
                <b-col>{{ row.item.Date1stTx }}</b-col>
                <b-col sm="3" class="text-sm-right"><b>Date Last Transaction</b></b-col>
                <b-col>{{ row.item.DatelastTx }}</b-col>
              </b-row>
               <b-row class="mb-2">
                <b-col sm="3" class="text-sm-right"><b>Lifetime</b></b-col>
                <b-col>{{ row.item.Lifetime }}</b-col>
                <b-col sm="3" class="text-sm-right"><b>Source</b></b-col>
                <b-col>{{ row.item.Sources }}</b-col>
              </b-row>
              <b-button size="sm" @click="row.toggleDetails">Hide Details</b-button>
            </b-card>
          </template>
        </b-table>
      </div>
      <div class="col-md-5">
        <FraudChart :transHashList='lables' :dataset='dataset' :height="500"></FraudChart>
       </div>
    </div>
    <div class="row">
      <div class="pageList">
        <b-pagination :total-rows="totalContracts" v-model="pageNum" :per-page="50" v-on:change="getNextPage">
        </b-pagination>
      </div>
    </div>
  </div>
</template>
<script>
import Chart from './Chart.vue'
import json from '../assets/json/file1.json'

export default {
  name: 'PonziContractList',
  components: {
    'FraudChart': Chart
  },
  data () {
    return {
      title: 'Ponzi Contracts',
      totalContracts: json.length,
      lables: [],
      dataset: [],
      fields: ['Id', 'Name', 'InTx', 'OutTx', 'show_details'],
      jsonString: json,
      pageNum: 1
    }
  },
  mounted () {
    this.$notifyInfo('Fetching data')
  },
  created () {
    this.createGraph(json)
  },
  methods: {
    getNextPage: function () {
      this.jsonString = json.slice(this.pageNum * 50, 50)
    },
    createGraph: function (objJson) {
      try {
        let dataArray = []
        let inArray = []
        let outArray = []
        let lableArray = []
        objJson.forEach(function (ele) {
          inArray.push(ele.InETH.substr(1).replace(':', '.'))
          outArray.push(ele.OutETH.substr(1).replace(':', '.'))
          lableArray.push(ele.Name)
        })
        dataArray.push(inArray)
        dataArray.push(outArray)
        this.$set(this.dataset, '1', dataArray)
        this.$set(this.lables, '2', lableArray)
      } catch (e) {
        this.$notifyError(e)
      }
    }
  }
}
</script>

<style src='../assets/css/common.css'>
</style>
