<template>
  <div id="app">
    <notifications group="global-notifier"/>
     <header class="header">
      <b-navbar toggleable="md" type="dark" variant="info">
        <b-navbar-brand href="/">Ethereum Block Explorer</b-navbar-brand>
         <b-navbar-nav>
          <b-nav-item href="/block">Block</b-nav-item>
          <b-nav-item href="/address/accounts">Address</b-nav-item>
          <b-nav-item href="/address/contracts">Contracts</b-nav-item>
          <b-nav-item href="/ponzifiles">Ponzi Schemes</b-nav-item>
        </b-navbar-nav>
        <b-navbar-nav class="ml-auto">
         <b-nav-form>
          <b-form-input size="sm" class="mr-sm-4" type="text" placeholder="Hash lookup" v-bind="searchHash"/>
          <b-link class="my-2 my-sm-0" :to= "{ path: 'search', params: {hash: searchHash}}"> Search </b-link>
        </b-nav-form>
        </b-navbar-nav>
      </b-navbar>
    </header>
    <router-view/>
  </div>
</template>

<script>
import SearchResult from './components/SearchResult'
export default {
  name: 'App',
  components: {
    SearchResults: SearchResult
  },
  data () {
    return {
      searchHash: ''
    }
  },
  methods: {
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
.header{
  position: fixed;
  width: 100%;
  z-index: 99;
  margin-bottom: 10px;
}
</style>
