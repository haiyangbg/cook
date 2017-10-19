<template>
  <div class="HeadImgWrapper">
    <div :class="size==='S' ? 'HeadImgS' : 'HeadImgB'">
      <template v-if="isDefaultHeadImg(url)">
        <div class="HeadImg" v-if="size==='S'"
             v-lazy:background-image="'/static/user/userImg-s.png'"
             :style="defaultUserHeadImgS[url]" ><!--style="background-image: url('../../../../static/user/userImg-s.png')"-->
        </div>
        <div class="HeadImg" v-else
             v-lazy:background-image="'/static/user/userImg.png'"
             :style="defaultUserHeadImg[url]"></div><!-- style="background-image: url('../../../../static/user/userImg.png')"-->
      </template>
      <div class="HeadImg userImg" v-else v-lazy:background-image="url" :style="'background-size: contain;'"></div><!--background-image: url('+url+');-->
    </div>

  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    data() {
      return {
        //小头像数组
        defaultUserHeadImgS : {
          wom0 : 'background-position: 0 0;',
          wom1 : 'background-position: -63px 0;',
          wom2 : 'background-position: -127px 0;',
          man0 : 'background-position: 0 -63px;',
          man1 : 'background-position: -63px -63px;',
          man2 : 'background-position: -127px -63px;'
        },
        //大头像数组
        defaultUserHeadImg : {
          wom0 : 'background-position: 0 0;',
          wom1 : 'background-position: -213px 0;',
          wom2 : 'background-position: -427px 0;',
          man0 : 'background-position: 0 -212px;',
          man1 : 'background-position: -213px -212px;',
          man2 : 'background-position: -427px -212px;'
        }

      }
    },
    props : {
      //大小
      size : {
        type : String,
        default : "S"
      },
      //图片路径
      url : {
        type : String,
        required: true
       },
      //id
      id : {
        default : ""
      }
    },
    computed : {

    },
    methods : {
      //判断是不是默认头像 true 是默认头像  false 不是默认头像
      isDefaultHeadImg(Imgurl) {
        let url = (Imgurl + '').slice(0, 3);
        if (url === "man" || url === "wom") {
          return true;
        }
        else {
          return false;
        }
      }
    }

  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .HeadImgWrapper
    font-size 0
    padding 0
    margin 0
    .HeadImgS
      display inline-block
      height 61px
      width 61px
      padding 1px
      border 1px solid #888
      border-radius: 50%
      overflow hidden
      background-color #78afa9
      cursor pointer
      .HeadImg
        display inline-block
        width 60px
        height 60px
    .HeadImgB
      border 4px solid rgba(199,199,199,0.8)
      border-radius 50%
      width 200px
      height 200px
      padding 1px
      .HeadImg
        width 100%
        height 100%
        background #fff
        border-radius 50%
        background-repeat no-repeat
</style>
