<template>
  <el-col :xs="24" :ms="24" :md="18" :lg="17" class="recommend" ref="recommend">
    <el-tabs @tab-click="tabsClick" v-model="tabChecked">
      <el-tab-pane label="主页推荐" name="0" style="background: transparent;">
        <template v-if="loading">
          <div v-if="isload" style="height: 200px; width: 100%; background: #eee; border-radius: 5px 5px 0 0;">
            <div style="padding-top: 60px;">
              <div style="width: 43px; height: 43px; margin: 0 auto;"><i class="el-icon-loading" style="font-size: 30px;"></i></div>
              <div style="width: 100px; height: 30px; margin: 0 auto;">拼命加载ing</div>
            </div>
          </div>
          <template v-if="!isload" v-for="(Fitem,Findex) in recommendList">
            <el-card class="card animated" :class="newLeftAnimate[Findex]">
              <div slot="header" class="cardHeader">
                <span class="cartHeaderTxt">{{ Fitem.name }}</span>
                <el-button class="cartHeaderBtn" type="default" @click="toSelect(Fitem.name.slice(0,-2))">查看更多 >></el-button>
              </div>
              <div class="listImgWrapper">
                <img class="listImg" v-lazy="newListImg[Findex].url" @click="toContent(newListImg[Findex].id)">
              </div>
              <template v-for="(item,index) in Fitem.content">
                <el-button-group class="listContent">
                  <div @mouseenter="changeImg(item.url,item.id,Findex)" @click="toContent(item.id)">
                    <el-button class="btnContent" :plain="true" type="success" @click="toContent(item.id)">
                      {{ index+1 }}.&nbsp;{{ item.name }},&nbsp;&nbsp;评分:&nbsp;&nbsp;&nbsp;&nbsp;<strong style="color: red;">{{ item.grade }}</strong>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                      <strong style="font-size: 10px;">{{item.content}}</strong>
                    </el-button>
                  </div>
                </el-button-group>
              </template>
            </el-card>
          </template>
        </template>
        <el-card v-else>
          <div slot="header"><i class="el-icon-close" style="margin: 0 15px;"></i>网络异常</div>
          <div style="color: red;">网络异常请检查网络或刷新页面</div>
        </el-card>
      </el-tab-pane>

      <el-tab-pane label="教程动态" name="1" ref="trendsLoad">
          <div ref="MyTrends">
            <template v-if="loadingT">
              <div v-if="trends.length" v-for="(item,index) in trends">
                <information :item="item" :index="item.type" class="animated fadeIn"></information>
              </div>
              <myloading :logLoading="dialogLoading" :AllTrends="isAllTrends"></myloading>
            </template>
            <el-card v-else>
              <div slot="header"><i class="el-icon-close" style="margin: 0 15px;"></i>网络异常</div>
              <div style="color: red;">网络异常请检查网络或刷新页面</div>
            </el-card>
          </div>
      </el-tab-pane>
    </el-tabs>

  </el-col>
</template>

<script type="text/ecmascript-6">
  import myloading from '../user/loading.vue'
  import information from '.././user/information.vue'

  import Vue from 'vue'
  import ElButtonGroup from 'element-ui/lib/button-group'
  import ElButton from 'element-ui/lib/button'
  import ElCard from 'element-ui/lib/card'
  import ElTabs from 'element-ui/lib/tabs'
  import ElTabPane from 'element-ui/lib/tab-pane'

  Vue.use(ElButtonGroup)
  Vue.use(ElButton)
  Vue.use(ElCard)
  Vue.use(ElTabs)
  Vue.use(ElTabPane)
  //Vue.use(Loading)

  export default {
    data() {
      return {
        recommendList : [
          { "name" : "" ,"content" : [
            { "id" : "" , "name" : "" ,"grade":"" , "url" : "" , "content" : "" }
          ]}
        ],                //推荐内容
        newListImg : [{"url" : "" , "id" : ""}],      //推荐内容当前图片
        animatesLeft : ['bounceInDown','bounceInLeft','bounceInUp','fadeInDownBig','fadeInLeftBig','fadeInUpBig'],
        newLeftAnimate : [],
        trends : [{ "id": "" , "title" : "" , "author" : "" , "type" : 1 ,"time" : "" , "img" : "" , "content" : "" , "grade" : "" , "discussNum" : "0" , "collect" : false },],
        //推荐加载
        loading : true,
        //动态加载
        loadingT : true,

        addScrollFlag : true,
        newTrendsIndex : 1,
        //是否可以滚动加载动态
        TrendsLoading : true,
        //正在加载新动态？
        dialogLoading : false,
        //是否加载全部
        isAllTrends : false,
        //是否正在加载推荐
        isload : true,
        //默认哪个tab被选中
        tabChecked : this.$store.state.tabchecked,
        //是否有记住滚动位置事件
        hasAddRemScroll : false,
        //下拉加载请求定时器
        timeOut : ""
      }
    },
    created() {
      this.trends.length = 0;
      //显示加载框
      this.dialogLoading = true;
      this.isAllTrends = false;
      if(this.$store.state.tabchecked === '0') {
        this.getRerecommend();
      }else {
        window.addEventListener('scroll', this.handleScroll,false);
        this.addScrollFlag = false;
        this.getTrends(1);
      }
    },
    mounted() {
      window.removeEventListener('scroll', this.remSrcoll,false);
      this.hasAddRemScroll = false;
      /*setTimeout(()=>{
        this.loadingHeight();
      },500);*/
    },
    computed :{
    },
    methods :{
      //高度不够加载下一页
      loadingHeight() {
        //运动定时器
        let time;
        //console.log(time);
        //clearTimeout(this.timeOut);
        if(document.body.scrollHeight < this.$store.state.scrollTop) {
          //window.scrollTo(0,document.body.scrollHeight - document.documentElement.clientHeight);
          this.myMove(time,document.body.scrollHeight);// - document.documentElement.clientHeight
          //this.getTrends(this.newTrendsIndex);
          //this.timeOut = setTimeout(()=>{
            //this.loadingHeight();
          //},800);
        }else {
          //clearTimeout(this.timeOut);
          //window.scrollTo(0,this.$store.state.scrollTop);
          this.myMove(time,this.$store.state.scrollTop);
          if(!this.hasAddRemScroll){
            window.addEventListener('scroll', this.remSrcoll,false);
            this.hasAddRemScroll = true;
          }
        }
      },
      //滚动条运动
      myMove(time,target) {
        clearInterval(time);
        //计算速度
        let speed = Math.floor(parseInt(target-window.pageYOffset)/8+1);
        if(speed <= 1) {
          return;
        }
        time = setInterval(function(){
          //console.log("??");
          if(window.pageYOffset === target) {
            clearInterval(time);
          }else {
            if(Math.abs(target - window.pageYOffset) > speed) {
              window.scrollTo(0,window.pageYOffset + speed);
            }
            else if(Math.abs(target - window.pageYOffset) <= speed) {
              window.scrollTo(0,target);
              clearInterval(time);
            }
          }

        },30);
      },
      remSrcoll() {
        if(this.$route.path !== "/course" && this.$route.path !== "/course/") {
          window.removeEventListener('scroll', this.remSrcoll,false);
          this.hasAddRemScroll = false;
        }else{
          //console.log("差值"+(this.$store.state.scrollTop - window.pageYOffset));
          //if(window.pageYOffset !== 0 && Math.abs(this.$store.state.scrollTop - window.pageYOffset) < 300)
          //{
            this.$store.state.scrollTop = window.pageYOffset;
            //console.log(this.$store.state.scrollTop);
          //}
        }
      },
      changeImg(url,id,index) {
        this.$set(this.newListImg,index,{ "url" : url ,"id" : id });
      },
      getLeftAnimate() {
        return this.animatesLeft[Math.floor(Math.random()*this.animatesLeft.length)];
      },
      //获取动态信息
      getTrends(index) {
        //现在不可以滚动加载动态
        this.TrendsLoading = false;
        //打开加载框
        this.dialogLoading = true;
        //网络有没有问题
        this.loadingT = true;
        this.newTrendsIndex++;
        this.axios.get('/api/trends/'+index+'').then((res)=>{
          //console.log(res.data);
          if(res.data.length !==0){
            for(let i = 0;i<res.data.length;i++) {
              this.trends.push(res.data[i]);
            }
            //this.timeSort(this.trends);
            //加载完成关闭加载框
            this.dialogLoading = false;
            //是否正在加载(关于滚动是否能触发加载)
            this.TrendsLoading = true;

            /////////////////////是否到滚到到上一次的地方了
            this.$nextTick(()=>{
              this.loadingHeight();
            });

          }else {
            //已加载全部
            this.isAllTrends = true;
            //显示加载框
            this.dialogLoading = true;
            //全部加载完毕取消滚动加载事件
            window.removeEventListener('scroll', this.handleScroll,false);

          }
        }).catch((err)=>{
          //console.log(err);
          //关闭动态显示框
          this.loadingT = false;
          //关闭加载框
          this.dialogLoading = false;
        });
      },
      getRerecommend() {
        this.isload = true;
        this.axios.get('/api/rerecommend').then((response) => {
          this.recommendList = response.data;
          this.ranking = response.data.ranking;
          this.newListImg.length = 0;
          for (let i = 0; i < this.recommendList.length; i++) {
            let obj = { "url" : "" , "id" : "" };
            obj.url = this.recommendList[i].content[0].url;
            obj.id = this.recommendList[i].content[0].id;
            this.newListImg.push(obj);
          }
          for(let m=0;m<this.recommendList.length;m++)
          {
            this.newLeftAnimate.push(this.getLeftAnimate());
          }
          this.isload = false;
        }).catch((error) => {
          this.loading = false;
          this.isload = false;
        });
      },
      tabsClick(tabs) {
        this.$store.state.tabchecked = tabs.name;
        if(tabs.name === '1') {
          if(this.addScrollFlag) {
            window.addEventListener('scroll', this.handleScroll,false);
            this.addScrollFlag = false;
          }
          if(this.TrendsLoading) {
            //判断动态长度是不是第一次加载
            if(this.trends.length === 0) {
              this.getTrends(this.newTrendsIndex);
              this.TrendsLoading = false;
            }
          }else {

          }
        }
        else {
          this.getRerecommend(1);
          window.removeEventListener('scroll', this.handleScroll,false);
          this.addScrollFlag = true;
        }
      },
      handleScroll(){
        if(this.$route.path !== "/course" && this.$route.path !== "/course/") {
          window.removeEventListener('scroll', this.handleScroll,false);
          this.addScrollFlag = true;
        }else {
          if(!this.dialogLoading) {
            let scrollTop = window.pageYOffset + document.documentElement.clientHeight;
            let trendsHeight = this.$refs["MyTrends"].getBoundingClientRect().height;
            if( scrollTop >= trendsHeight ) {
              this.getTrends(this.newTrendsIndex);
            }
          }
        }
      }
    },
    components: {
      information,
      myloading
    }
  };

</script>

<style lang="stylus" rel="stylesheet/stylus">
  listContentWidth = 70%
  cardMarginBottom = 30px
  contentBorderBottom = 1px solid rgba(0,0,0,0.4)

  .recommend
    .el-tabs__nav-wrap
      background #fff
      border-radius 5px 5px 0 0
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
    .listImgWrapper
      float left
      width 230px
      height 150px
      overflow hidden
      border-radius 5px
      .listImg
        width 230px
        float left
        cursor pointer
    .listContent
      float left
      margin-left 20px
      width listContentWidth
      height 35px
      border-bottom contentBorderBottom
      .btnContent
        height 35px
        line-height 35px
        span
          height 35px
          line-height 35px
      .btnContent
        width 100%
        border-radius 0
        border none
        padding 0 0 0 10px
        background rgba(255,255,255,0.1)
        &:hover
          background #eee
        span
          display inline-block
          text-overflow ellipsis
          overflow hidden
          width 100%

  @media screen and (max-width: 1780px)
    .recommend
      .listContent
        width 68%

  @media screen and (max-width: 1750px)
    .recommend
      .listContent
        width 63%
  @media screen and (max-width: 1470px)
    .recommend
      .listContent
        width 60%
  @media screen and (max-width: 1360px)
    .recommend
      .listContent
        width 55%
  @media screen and (max-width: 1230px)
    .recommend
      width 100%
      .listContent
        width 60%
  @media screen and (max-width: 1042px)
    .recommend
      .listContent
        width 60%
  @media screen and (max-width: 992px)
    .recommend
      .listContent
        width 65%
  @media screen and (max-width: 905px)
    .recommend
      .listContent
        width 65%
  @media screen and (max-width: 950px)
    .recommend
      .listContent
        width 64%
  @media screen and (max-width: 808px)
    .recommend
      .listContent
        width 61%
  @media screen and (max-width: 786px)
    .recommend
      .el-card
        padding-bottom 5px
        .el-card__body
          padding 2px
      .listContent
        width 95%
        .btnContent
          width 100%
      .listImgWrapper
        display none
        .listImg
          display none
</style>
