// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import BootstrapVue from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import * as backendCli from './utils/backend-client'
import VueChartkick from 'vue-chartkick'
import Chart from 'chart.js'
import Notification from 'vue-notification'

const url = process.env.NODE_ENV === 'development' ? 'http://localhost:3000/' : 'https://explorer.snet.tu-berlin.de/api/'

backendCli.initialize(url)

Vue.prototype.$baseUrl = url
Vue.prototype.$backendCli = backendCli
Vue.config.productionTip = false
Vue.use(BootstrapVue)
Vue.use(VueChartkick, {adapter: Chart})
Vue.use(Notification)

const libMethod = Vue.prototype.$notify
Vue.prototype.$notifyInfo = function (message) {
  libMethod({
    group: 'global-notifier',
    title: 'Info',
    type: 'info',
    text: message
  })
}
Vue.prototype.$notifyError = function (error) {
  console.warn('Error occurred', error)
  if (error.errorMessage) {
    error = error.errorMessage
  } else if (error.message) {
    error = error.message
  }
  libMethod({
    group: 'global-notifier',
    type: 'error',
    title: 'Oops... ',
    text: error
  })
}
Vue.prototype.$notify = Vue.prototype.$notifyInfo

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
