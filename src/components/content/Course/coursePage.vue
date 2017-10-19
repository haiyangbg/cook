<template>
  <div class="course">
    <el-row style="padding: 5px;" type="flex" justify="center">
      <el-col class="select" :xs="20" :ms="20" :md="18" :lg="17">
        <el-row>
          <el-col class="Option" :span="4" style="height: 50px;">
            <div class="back" @click="backMain">首页</div>
          </el-col>
          <el-col :span="20">
            <div @keyup.enter="mySelect">
              <el-input placeholder="请输入关键字" v-model="inputValue" class="input">
                <el-select style="width: 120px;" v-model="selectOption" slot="prepend" placeholder="快选" class="OptionHeader" @change="selectChange">
                  <el-option label="全部" value=""></el-option>
                  <el-option label="中餐" value="中餐"></el-option>
                  <el-option label="西餐" value="西餐"></el-option>
                  <el-option label="糕点" value="糕点"></el-option>
                  <el-option label="黑暗料理" value="黑暗料理"></el-option>
                </el-select>
                <el-button slot="append" icon="search" @click="mySelect"></el-button>
              </el-input>
              <div class="hot">
                <p class="hotHeader">热搜:</p>
                <a class="hotItem" :href="hot[index].url" v-for="(itme,index) in hot" @click="toSelect(itme.name)">{{ hot[index].name }}</a>
              </div>
            </div>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
    <el-row type="flex" justify="center">
      <el-col style="padding: 5px;" :xs="23" :ms="23" :md="18" :lg="17" class="CourseWrapper">
        <transition name="fade">
          <router-view></router-view>
        </transition>
      </el-col>
    </el-row>
    <backToTop :iFontsize="'35px'"></backToTop>
  </div>
</template>

<script type="text/ecmascript-6">
  import backToTop from '../.././MyComponent/backToTop.vue'

  import Vue from 'vue'
  import ElInput from 'element-ui/lib/input'
  import ElSelect from 'element-ui/lib/select'
  import ElOption from 'element-ui/lib/option'
  import ElButton from 'element-ui/lib/button'
  import ElMenu from 'element-ui/lib/menu'
  import ElMenuItem from 'element-ui/lib/menu-item'
  import ElSubmenu from 'element-ui/lib/submenu'

  Vue.use(ElMenu)
  Vue.use(ElMenuItem)
  Vue.use(ElSubmenu)
  Vue.use(ElInput)
  Vue.use(ElSelect)
  Vue.use(ElOption)
  Vue.use(ElButton)

  export default {
    data() {
      return {
        //course : {},       //全局数据对象
        hot : [],          //热搜列表
        selectOption : '', //选中的筛选值
        inputValue : ""   //输入框里输入的值
//        ,documentH : 0      //浏览器高度
      }
    },
    created() {
      document.body.style.backgroundImage = "url('/static/bg4.jpg')";
      this.axios.get('/api/hotSelect').then((response) => {
        //this.course = response.data;
        this.hot = response.data;
      }).catch((error) => { });
    },
    methods : {
      backMain() {
        this.$router.push('/course/');
      },
      mySelect() {
        this.toSelect(this.inputValue);
      },
      selectChange(value) {
        this.toSelect(value);
      },
      xx(){
        console.log("123");
      }
    },
    mounted() {
//      this.documentH = document.documentElement.clientHeight;
//      const that = this;
//      window.onresize = function temp() {
//        that.documentH = document.documentElement.clientHeight;
//      };
    },
    components : {
      backToTop
    }
  }

</script>

<style lang="stylus" rel="stylesheet/stylus">
  backColor = rgba(255,255,255,0.9)
  navItemColor = rgba(255,255,255,0.6)
  body
    background-position center center
    background-repeat no-repeat
    background-attachment fixed
    background-size cover
  .selectMenu
    background rgba(255,255,255,0.1)
    .el-menu-select
      height 50px
      background rgba(0,0,0,0)
      & > li
        border-bottom 4px solid transparent
        &:hover
          border-bottom 4px solid #57d2f7
      .row-item
        height 50px
        line-height 50px
        text-align center
        vertical-align top
        color navItemColor
        &:hover
          background rgba(255,255,255,0.1)
      .el-submenu
        border none
        &:hover
          border none
        & > .el-menu
          top 55px
          .el-menu-item
            text-align center
        & > div
          height 50px
          line-height 50px
          text-align center
          vertical-align top
          color navItemColor
          &:hover
            background rgba(255,255,255,0.1)

  .course
    z-index 300
    .select
      margin-top 12px
      .Option
        height 36px
        line-height 36px
        .back
          display inline-block
          cursor pointer
          text-align center
          font-size 20px
          margin-right 25px
          margin-left 25px
          letter-spacing 3px
          color backColor
      .hot
        margin-top 10px
        font-size 0
        .hotHeader
          display inline-block
          margin 0 10px 0 0
          font-size 14px
          color rgba(255,255,255,0.6)
        .hotItem
          display inline-block
          margin 0 5px 0 6px
          color #eb3f2f
          font-size 14px
          padding 3px
          cursor pointer
          &:hover
            color #b31800
            background rgba(255,255,255,0.9)
            border-radius 5px
      .el-input-group__append
        width 10%
        background rgba(131,252,216,0.9)
        &:hover
          background rgba(131,252,216,0.6)
        .el-button--default
          margin 0 auto
  @media screen and (max-width: 767px)
    .selectMenu
      display none
    .course
      .select
        .Option
          .back
            font-size 16px
            margin-right 5px
            margin-left 0
        .input
          .el-input-group__prepend
            display none
        .hot
          display none


</style>
