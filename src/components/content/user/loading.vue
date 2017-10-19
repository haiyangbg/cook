<template>
  <div v-if="logLoading" @click="Myclick" :style="AllTrends ? 'height: 80px;' : 'height: 200px;'" style="width: 100%; background: #eee; margin-bottom: 20px; border-radius: 5px;">
    <div :style="AllTrends ? 'padding-top: 26px;' : 'padding-top: 60px;'" style="">
      <div v-if="!AllTrends" style="width: 43px; height: 43px; margin: 0 auto;"><i class="el-icon-loading" style="font-size: 30px;"></i></div>
      <div :style=" AllTrends ? 'width:' + LoadedText.length * 18 +'px' : 'width: 100px'"
           style="height: 30px; margin: 0 auto;">{{ AllTrends ? LoadedText : "拼命加载ing" }}</div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {//
    data() {
      return {

      }
    },
    props : {
      //是否显示
      logLoading : {
        type : Boolean,
        default: false
      },
      //是否加载完成
      AllTrends : {
        type : Boolean,
        default: false
      },
      //加载全部显示的文字
      LoadedText : {
        type : String,
        default : "已加载全部"
      },
      Myclick : {
        type : Function,
        default : function () {
          return false;
        }
      }
    }

  }
</script>

<style lang="stylus" rel="stylesheet/stylus">

</style>
