<template>
  <div class="courseMain">
    <el-row>
      <router-view></router-view>
      <el-col :xs="0" :ms="0" :md="6" :lg="7" class="ranking">
        <template v-if="ranking[0].name" v-for="(Fitem,Findex) in ranking">
          <el-card class="card animated" :class="newRightAnimate[Findex]">
            <div slot="header" class="cardHeader"><span class="cartHeaderTxt">{{ Fitem.name }}</span></div>
            <template v-for="(item,index) in Fitem.content">
              <div @click="MyClick(Fitem.name,item)">
                <el-button-group class="rankingList">
                  <el-button :plain="true" type="default" class="iconfont" :class="'icon-paiming'+index" >
                    <span v-if="index > 2">{{ index +1 }}</span>
                  </el-button>
                  <el-button :plain="true" type="success" class="rankingContent">
                    <span class="RankingGrade" v-if="item.grade">{{ item.grade }}&nbsp;&nbsp;&nbsp;&nbsp;</span>{{ item.name }}
                  </el-button>
                </el-button-group>
              </div>
            </template>
          </el-card>
        </template>
      </el-col>
    </el-row>
  </div>
</template>

<script type="text/ecmascript-6">
  import Vue from 'vue'
  import ElButtonGroup from 'element-ui/lib/button-group'
  import ElButton from 'element-ui/lib/button'
  import ElCard from 'element-ui/lib/card'

  Vue.use(ElButtonGroup)
  Vue.use(ElButton)
  Vue.use(ElCard)

  export default {
    data() {
      return {
        ranking : [{ "name" : "" ,"content" : [
          { "id": "" , "name" : ""  }
          ]
        }],   //推荐内容
        animatesRight : ['bounceInDown','bounceInRight','bounceInUp','fadeInDownBig','fadeInRightBig','fadeInUpBig'],
        newRightAnimate : []
      }
    },
    created() {
      this.axios.get('/api/searchTop').then((response) => {
        //this.ranking = response.data;
        //this.ranking.push(response.data);
        this.$set(this.ranking,0,response.data);
        this.newRightAnimate.push(this.getRightAnimate());
      }).catch((error) => { });
      this.axios.get('/api/courseTop').then((response) => {
        //this.ranking.push(response.data);
        this.$set(this.ranking,1,response.data);
        this.newRightAnimate.push(this.getRightAnimate());
      }).catch((error) => { });
      document.body.style.overflow = 'auto';
    },
    computed :{

    },
    methods :{
      changeImg(url,id,index) {
        this.$set(this.newListImg,index,{ "url" : url ,"id" : id });
      },
      getLeftAnimate() {
        return this.animatesLeft[Math.floor(Math.random()*this.animatesLeft.length)];
      },
      getRightAnimate() {
        return this.animatesRight[Math.floor(Math.random()*this.animatesRight.length)];
      },
      MyClick(title,item) {
        if(title === "搜索排行") {
          this.toSelect(item.name);
        }else if(title === "评分排行"){
          this.toContent(item.id);
        }

      }
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  listContentWidth = 67%
  courseMainMarginTop = 30px
  cardMarginBottom = 30px
  contentBorderBottom = 1px solid rgba(0,0,0,0.4)
  @import '../../.././assets/css/iconfont.css'


  .courseMain
    margin-top courseMainMarginTop
    .el-card
      margin-bottom cardMarginBottom
      padding-bottom 20px
      .el-card__body
        padding 20px
      .el-card__header
        height 40px
        line-height 40px
        padding 0
    .card
      background rgba(255,255,255,0.9)
      .cardHeader
        height 40px
        .cartHeaderTxt
          height 40px
          line-height 40px
          margin-left 10px
          letter-spacing 2px
        .cartHeaderBtn
          border 0
          float right
          background rgba(0,0,0,0)
    .ranking
      padding-left 30px
      .el-card__body
        padding 10px
      .rankingList
        display block
        padding 2px 0
        cursor pointer
        &:hover
          background rgba(255,255,255,0.9)
          border-radius 8px
        .rankingContent
          height 40px
          background rgba(0,0,0,0)
          border 0
          border-radius 8px
          padding-right  2%
          padding-left 2%
          .RankingGrade
            color #726dd1
          span
            color #f2753f
            font-weight bold
            padding 0 10px 3px 10px
        .iconfont
          padding 0
          height 40px
          width 45px
          line-height 40px
          color #eb3f2f
          border none
          background rgba(0,0,0,0)
          font-size 28px
          text-align center
        .icon-paiming0
          font-size 35px

  @media screen and (max-width: 1231px)
    .course
      .CourseWrapper
        width 95%
  @media screen and (max-width: 990px)
    .ranking
      display none
    .listContent
      width 50%
  @media screen and (max-width: 767px)
    .el-card
      padding-bottom 5px
      .el-card__body
        padding 2px
</style>
