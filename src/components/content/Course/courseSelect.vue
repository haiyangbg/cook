<template>
  <el-col :xs="24" :ms="24" :md="18" :lg="17"  class="courseSelect">
    <el-collapse v-if="hasLoad" v-model="activeName">
      <el-radio-group v-model="radioValue" fill="#666" @change="radioChange">
        <el-radio-button label="图文教程" :disabled="!wordFlag" ></el-radio-button>
        <el-radio-button label="视频教程" :disabled="!movieFlag" ></el-radio-button>
      </el-radio-group>
      <template v-if="!isload" v-for="(item,index) in this.newMessage.content">
        <el-collapse-item :title="item.name" :name="index">
          <template slot="title">
            <span class="name">{{ item.name }}</span><span class="grade">评分:&nbsp;&nbsp;<strong class="num">{{ item.grade }}</strong></span><i v-if="item.grade >= 9.0" class="el-icon-star-on"></i>
          </template>
          <div class="imgWrapper">
            <img v-lazy="item.url" alt=""><!-- :src="item.url"-->
          </div>
          <div class="content">
            <template style="margin-bottom: 10px;">
              <span class="name" style="min-width: 80px; width: 25%; margin-left: -1px;">{{ item.name }}</span><span class="grade">评分:&nbsp;&nbsp;<strong class="num">{{ item.grade }}</strong></span>
            </template>
            <br>
            <span style="font-weight: bold;">详细介绍 :</span><br><span style="font-size: 15px;">{{ item.content }}</span>
            <el-button type="success" class="btn" @click="toContent(item.id)">详细做法</el-button>
          </div>
        </el-collapse-item>
      </template>
      <div v-if="isload" style="height: 200px; width: 100%; background: #eee; border-radius: 5px 5px 0 0;">
        <div style="padding-top: 60px;">
          <div style="width: 43px; height: 43px; margin: 0 auto;"><i class="el-icon-loading" style="font-size: 30px;"></i></div>
          <div style="width: 100px; height: 30px; margin: 0 auto;">拼命加载ing</div>
        </div>
      </div>
      <div class="pagination" >
        <el-pagination class="paginationNav" @current-change="chioceTypeContent" :current-page.sync="currentPage" :page-size="10" layout="total, prev, pager, next" :total="allCount">
        </el-pagination>
      </div>

    </el-collapse>
    <el-card v-else >
      <div slot="header">
        <i class="el-icon-close" style="padding-left: 15px;"></i><span style="line-height: 36px; padding-left: 10px; letter-spacing: 1px;">未找到该教程</span>
      </div>
      <div>
        您查找的教程不存在，点击按钮返回&nbsp;<el-button type="danger" style="margin-left: 10px;" @click="errorBack">返回</el-button>
      </div>
    </el-card>


  </el-col>
</template>

<script type="text/ecmascript-6">
  import qs from 'qs'
  import Vue from 'vue'
  import ElCollapse from 'element-ui/lib/collapse'
  import ElCollapseItem from 'element-ui/lib/collapse-item'
  import ElCard from 'element-ui/lib/card'
  import ElPagination from 'element-ui/lib/pagination'
  import ElButton from 'element-ui/lib/button'
  import ElRadioGroup from 'element-ui/lib/radio-group'
  import ElRadioButton from 'element-ui/lib/radio-button'
  Vue.use(ElCollapse)
  Vue.use(ElCollapseItem)
  Vue.use(ElCard)
  Vue.use(ElPagination)
  Vue.use(ElButton)
  Vue.use(ElRadioGroup)
  Vue.use(ElRadioButton)

  export default {
    data() {
      return {
        radioValue : "图文教程", //radio默认选择哪一个 视频教程
        wordFlag : false,      //图文按钮是否激活
        movieFlag : false,      //movie按钮是否激活
        hasLoad : true,
        ID : this.$store.state.selectKey, //搜索的关键字
        newMessage : {
          "newPage" : 1,
          "allCount" : 100,
          "content" : [
            { "id": "" ,"grade" : "" , "name" : "" , "url" : "" , "content" : "" }]
        },                      //当前是什么教程
        selectContent : { "hasMovie" : "" },//查找到的所有图文教程
        selectMovie : {},       //查找到的所有movie教程
        activeName : 0,         //哪个tab选项处于打开状态
        contentActiveName : 0,         //图文哪一选项处于打开状态
        movieActiveName : 0,         //视频哪一选项处于打开状态
        currentPage : 1,        //当前处于哪一页
        contentPage : 1,        //图文教程当前处于哪一页
        moviePage : 1,           //视频教程当前处于哪一页
        radCheck : true,
        //找到了教程？
        hasCourse : true,
        //一个多少条
        allCount : 0,
        isload : true
      }
    },
    created() {
      //document.body.style.backgroundImage = "url('./static/bg4.jpg')";
      //this.ID = this.$route.query.id;
      this.getPageContent(this.currentPage,this.firstLoad);
      //this.activeName = 0;
      window.scrollTo(0,0);
    },
    computed : {
      changeID() {
        return this.$store.state.selectKey;
      }
    },
    watch: {
      changeID(val) {
        this.currentPage = 1;
        this.ID = val;
        this.getPageContent(this.currentPage,this.firstLoad);
      }
    },
    methods : {
      firstLoad() {
        this.wordFlag = !!this.selectContent.content.length;
        this.movieFlag = !!this.selectContent.hasMovie;

        if(this.newMessage.content.length === 0 && this.movieFlag) {
          this.radioValue = "视频教程";
          this.getPageMovie(1);
        }else if(this.newMessage.content.length === 0 && !this.movieFlag) {
          this.hasCourse = false;
        }

      },
      chioceTypeContent(pagenum) {
        if(this.radioValue === "图文教程") {
          this.contentPage = pagenum;
          this.getPageContent(pagenum);
        }
        else {
          this.moviePage = pagenum;
          this.getPageMovie(pagenum);
        }
      },
      getPageContent(pagenum,fn) {
        this.isload = true;
        this.axios.post("/api/select", qs.stringify({"pageIndex":  pagenum  , "key" : this.ID  , "type": 0 })).then((res) => {

          this.allCount = res.data.allCount;
          this.newMessage = this.selectContent = res.data;
          this.isload = false;
          if(fn){
            fn();
          }
        }).catch((err)=>{
          this.newMessage.content =  [
            { "id": "查找失败" ,"grade" : "0.0" , "name" : "查找失败" , "url" : "" , "content" : "网络异常，请重试" }];
          this.hasLoad = false;
          this.isload = false;
        });
      },
      getPageMovie(pagenum) {
        this.isload = true;
        this.axios.post("/api/select", qs.stringify({"pageIndex":  pagenum  , "key" : this.ID , "type": 1 })).then((res) => {
          this.allCount = res.data.allCount;
          this.newMessage = this.selectMovie = res.data;
          this.isload = false;
        }).catch(()=>{
          this.newMessage.content =  [
            { "id": "查找失败" ,"grade" : "0.0" , "name" : "查找失败" , "url" : "" , "content" : "网络异常，请重试" }];
          this.hasLoad = false;
          this.isload = false;
        });
      },
      errorBack() {
        window.history.go(-1);
      },
      radioChange(target) {
        if(target === "视频教程") {
          this.allCount = this.selectMovie.allCount;
          //展开
          this.contentActiveName = this.activeName;
          this.activeName = this.movieActiveName;
          this.$nextTick(function () {
            //页码
            this.currentPage = this.moviePage;
            //更换当前显示的信息  if判断是否需要再次请求
            if(!this.selectMovie.newPage) {
              this.getPageMovie(1);
            }
            else {
              //this.currentPage = this.moviePage;
              this.newMessage = this.selectMovie;
            }
          });
        }
        else {
          this.allCount = this.selectContent.allCount;
          //展开
          this.movieActiveName = this.activeName;
          this.activeName = this.contentActiveName;
          this.$nextTick(function () {
            //页码
            this.currentPage = this.contentPage;
            //更换当前显示的信息
            this.newMessage = this.selectContent;
          });
        }
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .courseSelect
    .el-collapse
      border rgba(0,0,0,0)
      border-radius 10px
      overflow hidden
      margin-top -30px
    .el-pagination
      padding 0
      height 35px
      line-height 35px
      padding-top 10px
      .el-pagination__total
        padding-top 5px
    .pagination
      background rgb(255,255,255)
      height 55px
      line-height 55px
      .number,.el-icon,.btn-prev,.btn-next
        height 35px
        line-height 35px
        color #000
      .number,.el-icon
        width 35px
    .name
      display inline-block
      font-weight bold
      margin-left 5px
      font-size 16px
      width 8%
      min-width 60px
    .imgWrapper
      float left
      width 300px
      height 220px
      img
        width 300px
        border-radius 8px
        float left
        cursor pointer
    .content
      float left
      margin-left 20px
      width 50%
      span
        display inline-block
        line-height 30px
      .btn
        float right
        height 40px
        line-height 40px
        padding 0 10px 0 10px
        margin-bottom 5px
        span
          line-height 40px
          text-align center
          vertical-align top
    .grade
      margin-left 20px
      margin-right 20px
      .num
        color #eb3f2f
    .el-icon-star-on
      color #b31800

  @media screen and (max-width: 1200px)
    .courseSelect
      width 100%
  @media screen and (max-width: 510px)
    .el-pagination
      .el-pager
        .number,.el-icon
          width 25px
      .btn-prev,.btn-next
        width 30px
        padding-left 0
        padding-right 15px
      .el-pagination__total
        display none

</style>
