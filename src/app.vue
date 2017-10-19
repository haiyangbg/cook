<template>
  <div id="app">
    <v-header></v-header>
    <transition name="fade">
      <router-view></router-view>
    </transition>
  </div>
</template>

<script type="text/ecmascript-6">
  import header from './components/header/header.vue';
  export default{
    components: {
      'v-header':header
    },
    created(){

    }
  }

</script>

<style lang="stylus" rel="stylesheet/stylus">

</style>
