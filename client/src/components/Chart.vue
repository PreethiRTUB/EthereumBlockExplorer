
<script>
import { Line } from 'vue-chartjs'
export default ({
  extends: { mixins: [Line] },
  name: 'app',
  props: {
    transHashList: Array,
    dataset: Array
  },
  data () {
    return {
      options: {
        scales: {
          yAxes: [{
            gridLines: {
              display: true
            }
          }],
          xAxes: [ {
            gridLines: {
              display: true
            }
          }]
        },
        legend: {
          display: false
        },
        responsive: true,
        maintainAspectRatio: false
      }
    }
  },
  watch: {
    'dataset': {
      handler: function () {
        this.renderLineChart()
      }
    }
  },
  computed: {
    chartData: function () {
      debugger
      return this.dataset[1]
    },
    chartLabel: function () {
      return this.transHashList[2]
    }
  },
  mounted () {
    this.renderLineChart()
  },
  methods: {
    renderLineChart: function () {
      this.renderChart(
        {
          labels: this.chartLabel,
          datasets: [
            {
              label: 'Value',
              backgroundColor: '#f87979',
              data: this.chartData[0]
            }
            // ,
            // {
            //   label: 'Amount Out',
            //   backgroundColor: '#ffc770',
            //   data: this.chartData[1]
            // }
          ]
        },
        this.options
      )
    }
  }
})
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
  }
  #content {
    margin: auto;
    width: 1024px;
    background-color: #FFFFFF;
    padding: 20px;
    }
</style>