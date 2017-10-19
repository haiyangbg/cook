<template>
  <div class="informationItem">
    <div class="title clearfix">
      <span class="trendsTitle" @click="toContent(item.id)">{{ item.title }}</span><span class="trendsAuthor" @click="toUser(item.authorid)" v-if="!isMyself">作者&nbsp;:&nbsp;{{ item.author}}</span>
      <template  v-if="!isMyself">
        <span v-if="item.type === '0'" class="trendsType"><i class="iconfont icon-tuwen" style="padding-right: 5px; font-size: 21px;"></i>图文</span>
        <span class="trendsType" v-else><i class="iconfont icon-shipin" style="padding-right: 5px; font-size: 21px;"></i>视频</span>
      </template>
      <span class="trendsTime">{{ getDifTime(item.time) }}</span>
    </div>
    <div class="trendsContent clearfix">
      <div v-if="item.img" class="trendsCover" v-lazy:background-image="item.img" @click="toContent(item.id)"></div><!--:style="'background-image: url('+item.img+')'" -->
      <div v-else class="trendsCover" style="background-image: url('/static/error.png'); background-repeat: no-repeat; background-size: contain;"></div>
      <div class="trendsText" @click="toContent(item.id)">
        <span class="textGrade">评分: <strong style="color: red; padding-left: 12px;">{{ item.grade }}</strong></span><br>
        <p class="textContent" :class="{ 'textContentAfter' : (item.content + '').length > 57 }" >{{ item.content }}</p>
      </div>
    </div>
    <div class="footer">
      <span class="footerItem" @click="toContent(item.id)">评论&nbsp;{{ item.discussNum }}</span>
      <template v-if="!isMyself">
        <span class="footerItem" v-if="isCollect" @click="collectChange"><i class="el-icon-star-on" style="margin-right: 5px;"></i>已收藏</span>
        <span class="footerItem" v-else @click="collectChange"><i class="el-icon-star-off" style="margin-right: 5px;"></i>收藏</span>
      </template>
      <span class="footerItem" v-if="isMyself"><i class="el-icon-setting" style="margin-right: 5px;"></i>设置</span>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import qs from 'qs'
  export default {
    data() {
      return {
        check : false,
        isCollect : false    //是否收藏， true 已收藏 , false 没有收藏
      }
    },
    props : {
      item : {
        required: true,
        default : { "id": "" , "title" : "" , "authorid" : "" , "author" : "" , "type" : 0 , "time" : "" , "img" : "" , "content" : "" , "grade" : "" , "discussNum" :"" , "collect" : false }
      },
      //type 0图文 1视频
      index : {
        type : [String,Number],
        default : '0'
      },
      isMyself : {
        type : Boolean,
        default : false
      }
    },
    created() {
      //console.log(this.item);
      this.isCollect = this.item.collect;
    },
    methods : {
      //时间差值
      getDifTime(t) {
        return this.$moment(t,'YYYYMMDDHmm').fromNow();
      },
      collectChange() {
        this.isCollect = !this.isCollect;
        if(!this.check) {
          this.check = true;
          setTimeout(()=>{
            if(this.isCollect === this.item.collect) {
              return true;
            }
            else {
              if(this.isCollect === true) {
                this.axios.post('/api/collectA',
                  qs.stringify({ "id" : this.item.id , "type" : this.item.type ,"time" : this.$moment().format('YYYYMMDDHmm')})
                ).then((res) => {
                  //console.log(res.data);
                  if(res.data) {
                    this.isCollect = true;
                    //设置原数据
                    this.item.collect = true;
                  } else {
                    this.isCollect = false;
                  }
                  this.check = false;
                }).catch(()=>{
                  this.isCollect = this.item.collect;
                  this.check = false;
                });
              }else {
                this.axios.post('/api/collectD',
                  qs.stringify({ "id" : this.item.id })
                ).then((res) => {
                  //console.log(res.data);
                  if(res.data) {
                    this.isCollect = false;
                    //设置原数据
                    this.item.collect = false;
                  } else {
                    this.isCollect = true;
                  }
                  this.check = false;
                }).catch(()=>{
                  this.isCollect = this.item.collect;
                  this.check = false;
                });

              }
            }
          },1000);
        }
      },
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  trendsBorderStyle = 1px solid #ddd

  tabsContentColor = #fff
  tabsTopBottomColor = #fffee0

  .informationItem
    font-size 0
    width 100%
    margin-bottom 15px
    .title
      font-size 0
      width 100%
      height 40px
      border-top trendsBorderStyle
      border-bottom trendsBorderStyle
      background tabsTopBottomColor
      .trendsTitle,.trendsAuthor,.trendsType,.trendsTime
        font-size 16px
        height 40px
        line-height 40px
        cursor default
        display inline-block
      .trendsTitle
        font-size 18px
        font-weight bold
        padding 0 2px
        cursor pointer
      .trendsAuthor
        font-size 15px
        color #777
        padding 0 4px
        cursor pointer
      .trendsType
        height 40px
        line-height 40px
        font-size 16px
        letter-spacing 1px
        padding-left 3px
      .trendsTime
        float right
        padding-right 3px
    .trendsContent
      width 100%
      height 170px
      background #fff
      padding 5px 0 5px 5px
      box-sizing border-box
      .trendsCover
        display inline-block
        border-radius 8px
        cursor pointer
        float left
        width 200px
        height 140px
        background-size cover
        background-position center center
        background-repeat no-repeat
        margin-top 10px
      .trendsText
        font-size 16px
        cursor pointer
        box-sizing border-box
        display inline-block
        overflow hidden
        float left
        width 50%
        height 150px
        padding 10px 0 0 20px
        .textGrade
          display inline-block
          margin 10px 0
        .textContent
          position relative
          display inline-block
          margin-top 5px
          height 75px
          line-height 24px
          letter-spacing 1px
          font-size 17px
          overflow hidden
          padding-right 20px
          &:hover
            text-decoration underline
    .footer
      height 40px
      width 100%
      border-top trendsBorderStyle
      border-bottom trendsBorderStyle
      background tabsTopBottomColor
      .footerItem
        display inline-block
        font-size 16px
        height 40px
        line-height 40px
        padding 0 30px
        cursor pointer
        &:nth-child(odd)
          border-right 1px solid #eee
        &:hover
          background #ddd
  @media screen and (max-width: 1004px)
    .informationItem
      .trendsContent
        .trendsCover
          display none
        .trendsText
          width 90%

  @media screen and (max-width: 400px)
    .informationItem
      .footer
        .footerItem
          padding 0 15px
</style>
