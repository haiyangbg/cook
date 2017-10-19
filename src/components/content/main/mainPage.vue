<template>
  <div class="mainPage" @wheel.prevent="menuScroll">
    <el-carousel :interval="5000" :height="carourolH+'px'" class="carousel" @change="carouselChange" ref="MyCarousel">
      <el-carousel-item v-lazy:background-image="imgs[index]" v-for="(item,index) in imgNum" :key="index" class="carousel-item">
        <el-tooltip content="点击查看详情" placement="top">
          <div class="Animate" :class="[PStyle,highL]" @mouseenter="showWrapper" @mouseleave="hideWrapper">
            <h1 class="nameAnimate animated" v-show="nameAnimate" :class="nameAnimate">{{ imgName[index] }}</h1>
            <p class="contentAnimate animated" v-show="contentAnimate" :class="contentAnimate">{{ imgContent[index] }}</p>
          </div>
        </el-tooltip>
        <div class="wrapper" :class="wrapperBg"></div>
      </el-carousel-item>
    </el-carousel>
  </div>
</template>

<script type="text/ecmascript-6">
  import Vue from 'vue'
  import ElCarousel from 'element-ui/lib/carousel'
  import ElCarouselItem from 'element-ui/lib/carousel-item'
  import ElTooltip from 'element-ui/lib/tooltip'
  Vue.use(ElCarousel)
  Vue.use(ElCarouselItem)
  Vue.use(ElTooltip)


  export default{
    data() {
      return{
        ImgMsg :[],
        imgNum : 0,
        imgs: [],
        imgName :[],
        imgContent :[],
        carourolH : 0,
        animates : ['bounceInDown','bounceInLeft','bounceInRight','bounceInUp','fadeInDownBig','fadeInLeftBig','fadeInRightBig','fadeInUpBig'],
        nameAnimate : false,
        contentAnimate : false,
        PositionStyle : ['Pleft','Pright'],
        PStyle : 'Pright',
        wrapperBg : '',
        highL : ''
      }
    },
    created() {
      this.axios.get('/api/mainImg').then((response) => {
        this.imgNum = response.data.length;
        this.ImgMsg = response.data;
        for(let i=0;i<this.ImgMsg.length;i++)
        {
          this.imgs.push(this.ImgMsg[i].url);
        }
        for(let i=0;i<this.ImgMsg.length;i++)
        {
          this.imgName.push(this.ImgMsg[i].name);
        }
        for(let i=0;i<this.ImgMsg.length;i++)
        {
          this.imgContent.push(this.ImgMsg[i].content);
        }
      }).catch((error) => {
      });

    },
    computed:{

    },
    mounted() {
      document.body.style.overflow = 'hidden';

      this.carourolH = document.documentElement.clientHeight;
      const that = this;
      window.onresize = function temp() {
        that.carourolH = document.documentElement.clientHeight;
      };
      if(document.attachEvent){
        document.attachEvent('onmousewheel',this.menuScroll);
      }
      if(document.addEventListener){
        document.addEventListener('DOMMouseScroll',this.menuScroll);
      }
    },
    methods:{
      menuScroll(e){
        if(this.$route.path === "/"){
          let delta = e.wheelDelta || (-e.deltaY * 24);
          //下滚
          if(delta<0){
            this.$refs.MyCarousel.next();
          }
          //上滚
          if(delta>0){
            this.$refs.MyCarousel.prev();
          }
        }
        else {
          document.removeEventListener('DOMMouseScroll',this.menuScroll);
          if(document.attachEvent){
            document.detachEvent('onmousewheel',this.menuScroll);
          }
        }
      },
      carouselChange(){
        try{
          clearTimeout(this.TimeoutTrue);
          clearTimeout(this.TimeoutFalse);
        }
        catch(e) {}
        finally {
          this.nameAnimate = false;
          this.contentAnimate = false;
        }
        this.TimeoutTrue = setTimeout(()=>{
          this.nameAnimate = this.getanimate();
          this.contentAnimate = this.getanimate();
          this.PStyle = this.getPStyle();
        },500);
        this.TimeoutFalse = setTimeout(()=>{
          this.nameAnimate = true;
          this.contentAnimate = true;
        },3000);
      },
      getanimate() {
        return this.animates[Math.floor(Math.random()*this.animates.length)];
      },
      getPStyle() {
        return this.PositionStyle[Math.floor(Math.random()*this.PositionStyle.length)];
      },
      showWrapper() {
        this.wrapperBg = "wrapperBg";
        this.highL = "highL";
      },
      hideWrapper() {
        this.wrapperBg = "";
        this.highL = "";
      }
    }
  }

</script>

<style lang="stylus" rel="stylesheet/stylus">
  .mainPage
    .carousel
      top -50px
      height 100%
      width 100%
      .carousel-item
        background-repeat no-repeat
        background-position center center
        height 100%
        width 100%
        .Animate
          position absolute
          width 30%
          cursor pointer
          padding 15px
          border-radius 12px
          z-index 100
          .contentAnimate
            position relative
            display block
            font-size 18px
            line-height 32px
            font-weight bold
            color #495a80
            z-index 101
          .nameAnimate
            position relative
            display block
            line-height 32px
            color #726dd1
            margin-bottom 10px
            z-index 101
        .Pleft
          left 3%
          top 15%
        .Pright
          right 3%
          top 15%
        .highL
          background rgba(255,255,255,0.8)
      .el-carousel__arrow
        height 130px
        width 40px
        z-index: 11
        background rgba(0,0,0,0.2)
        &:hover
          background rgba(0,0,0,0.4)
      .el-carousel__indicators
        z-index 900
        bottom 20px
        .el-carousel__indicator
          margin-left 3px
          margin-right 2px
          .el-carousel__button
            height 5px
            width 55px
            border-radius 3px
        .is-active
          .el-carousel__button
            background #726dd1
    .wrapper
      position absolute
      top 0
      left 0
      width 100%
      height 100%
      z-index 2
    .wrapperBg
      background rgba(0,0,0,0.3)


  @media screen and (max-width: 767px)
    .mainPage
      .carousel
        .el-carousel__arrow
          height 60px
          width 25px
        .el-carousel__indicators
          .el-carousel__indicator
            margin-left 1px
            margin-right 1px
            .el-carousel__button
              height 3px
              width 20px
        .carousel-item
          .Animate
            width 60%
            padding 6px
            max-height 350px
            overflow hidden
            .contentAnimate
              font-size 10px
              line-height 25px
              font-weight 300
            .nameAnimate
              font-size 22px
              line-height 35px
              font-weight bold
</style>
