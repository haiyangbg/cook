<template>
  <div class="courseContent">
    <el-card class="MsgInfo">
      <div slot="header" class="header">
        <span>{{ courseContent.name }}</span>
        <el-checkbox-button :class="isCollect ? 'checked' : 'check'" :checked="isCollect" @change="collectChange" class="collect">{{ isCollect ? "已收藏" : "收藏" }}</el-checkbox-button>
      </div>
      <div class="message">
        <div class="content clearfix">
          <div class="listImgWrapper">
            <img class="listImg" :src="this.courseContent.url">
          </div>
          <div class="title">
            <span class="name">{{ courseContent.name }}</span><span class="grade"> 评分&nbsp;&nbsp;:&nbsp;&nbsp;<strong style="color: red;">{{ courseContent.grade }}</strong></span><span class="author"> 作者 : {{ this.courseContent.author }}</span><br>
            <br><strong style="line-height: 30px; letter-spacing: 2px;">详细介绍:</strong><br><span class="messageContent">{{ courseContent.content }}</span>
          </div>
        </div>
        <div class="procedure" v-if="courseContent.type === '0'">
          <el-switch style="display: inline-block;" @change="switchChange" :width="100" v-model="isProcedure" on-color="#13ce66" off-color="#20A0FF" on-text="步骤模式" off-text="阅览模式">
          </el-switch>
          <br><br>
          <div class="step clearfix" v-show="isProcedure">
            <div style="float: left;" class="stepBtn" @click="stepPre"><i class="el-icon-arrow-left"></i></div>
            <el-steps class="stepMain" :active="stepActive" space="10%" finish-status="success" >
              <el-step v-for="(item,index) in this.courseContent.procedure.length" :title="'步骤'+(index+1)" :key="index"></el-step>
            </el-steps>
            <div style="float: right;" class="stepBtn" @click="stepNext"><i class="el-icon-arrow-right"></i></div>
          </div>
          <template v-for="(item,index) in this.procedureMessage">
            <div class="procedureMessage clearfix">
              <div class="procedureImgWrapper" :style="isFloat[index]">
                <img class="procedureImg" v-lazy="item.img ? item.img : '/static/img/error.jpg'" ><!--:src="item.img ? item.img : '/static/img/error.jpg'"-->
              </div>
              <div class="procedureContentWrapper">
                <h4 class="h">{{ item.title ? item.title : '步骤'}}<template v-if="!item.title">{{ isProcedure ?  (newStep) : (index + 1)}}</template></h4>
                <div class="text">
                  <ol>
                    <li v-for="(li,ind) in item.content.split(',')">{{ li }}</li>
                  </ol>
                </div>
                <el-button v-show="isProcedure" type="success" class="nextBtn" @click="stepNext">{{ isOver }}</el-button>
              </div>

            </div>
          </template>
        </div>
        <div class="movie" v-else>
          <my-video :sources="video.sources" :options="video.options"></my-video>
        </div>
      </div>
      <div class="discuss">
        <el-collapse v-model="activeName">
          <el-collapse-item name="0">
            <template slot="title">
              <span>评论&nbsp;({{ discussNum }})</span>
            </template>
            <template v-for="(item,index) in discuss">
              <div class="discussWrapper clearfix">
                <div class="disheadimg">
                  <div @click="toUser(item.id)" style="cursor: pointer; float: left; margin: 8px 15px 0 30px;">
                    <headImg :size="'S'" :url="item.url"></headImg>
                  </div>
                </div>
                <div class="discussContent">
                  <span  @click="toUser(item.id)" style="cursor: pointer; padding-top: 8px; box-sizing: border-box; display: inline-block; color:#777;">{{ item.name }}</span>
                  <span style="display: inline-block; margin-left: 8px;">{{ getDifTime(item.time) }}</span>
                  <span style="display: block; margin-top: 5px;">{{ item.content }}</span>
                </div>
              </div>
            </template>
            <div style="border-top: 5px #aaa solid; padding: 3px 0 8px 0;">
              <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4}" placeholder="请输入评论" v-model="mydiscuss"></el-input>
              <el-button type="info" @click="senddiscuss" style="float: right; margin-right: 10px; margin-top: 5px;">发表评论</el-button>
              <el-button type="danger" @click="mydiscuss = ''" style="float: right; margin-right: 10px; margin-top: 5px;">取消</el-button>
            </div>
          </el-collapse-item>
        </el-collapse>
      </div>
    </el-card>
  </div>
</template>

<script type="text/ecmascript-6">
  import headImg from '.././user/headimg.vue'
  import qs from 'qs'
  import myVideo from '../.././MyComponent/video.vue'
  import vue from 'vue'
  import ElCard from 'element-ui/lib/card'
  import ElCheckboxButton from 'element-ui/lib/checkbox-button'
  import ElSwitch from 'element-ui/lib/switch'
  import ElSteps from 'element-ui/lib/steps'
  import ElStep from 'element-ui/lib/step'
  import ElButton from 'element-ui/lib/button'
  import collect from 'element-ui/lib/collapse'
  import collectItem from 'element-ui/lib/collapse-item'
  import message from 'element-ui/lib/message'

  vue.use(ElCard)
  vue.use(ElCheckboxButton)
  vue.use(ElSwitch)
  vue.use(ElSteps)
  vue.use(ElStep)
  vue.use(ElButton)
  vue.use(collect)
  vue.use(collectItem)
  export default {
    data() {
      return {
        courseContent : {
          "id": "" , "name" : "" , "grade":"" , "author" : "" , "collect" : "" , "url" : "" , "content" : "","type" : '0',
          "procedure" : [
            { "title" : "" , "img" : "" , "content" : "" }
          ]
        },
        video: {
          sources: [{
            src: '/static/movie/t.mp4',
            type: 'video/mp4'
          }],
          options: {
            autoplay: false,
            volume: 0.6,
            poster: '/static/movie/movie.jpg'
          }
        },
        stepCount : 1,
        isCollect : false,    //是否收藏， true 已收藏 , false 没有收藏
        isProcedure : true,    //是否是步骤式列表， true 步骤式列表 , false 阅览列表
        stepActive : 0,         //当前激活的步骤索引
        newStep : 1,            //现在显示的是第几步  /(isProcedure ? (index + 1) : (newStep)
        procedureMessage : [{ "title" : "" , "img" : "" , "content" : "" }],    //当前的所展示的信息
        countMessage : [],         //所有信息
        isFloat : [],
        floatLeft : { 'float' : 'left' },
        floatRight : { 'float' : 'right' },
        isOver : '下一步',
        id : this.$route.query.id,
        //是否点了收藏
        check : false,
        //评论集合
        discuss : [{ "id" : "" , "url" : "" , "name":"" , "time" : "" , "content" : "" }],
        discussNum : 0,
        mydiscuss : this.$store.state.mydiscuss,
        activeName : '0'
      }

    },
    created() {
      document.body.style.overflow = 'auto';
      window.scrollTo(0,0);
      this.axios.get('/api/courseMsg/'+ this.id+'').then((res) => {
        //console.log(res.data);
        this.courseContent = res.data;
        this.stepCount = this.courseContent.procedure.length ;
        this.isCollect = this.courseContent.collect;

        this.countMessage = this.courseContent.procedure;
        if(this.courseContent.type === '0') {
          this.$set(this.procedureMessage,0,this.countMessage[0]);
          this.changeFloat();
        }else {
          this.video.sources.src = this.countMessage[0].content;
          this.video.options.poster = this.courseContent.url;
        }
        this.getdiscuss();
      }).catch((error)=>{ });

    },
    methods :{
      collectChange() {
        this.isCollect = !this.isCollect;
        if(!this.check) {
          this.check = true;
          setTimeout(()=>{
            if(this.isCollect === this.courseContent.collect) {
              return true;
            }
            else {
              if(this.isCollect === true) {
                this.axios.post('/api/collectA',
                  qs.stringify({ "id" : this.courseContent.id , "type" : this.courseContent.type ,"time" : this.$moment().format('YYYYMMDDHmm')})
                ).then((res) => {
                  //console.log(res.data);
                  if(res.data) {
                    this.isCollect = true;
                    //设置原数据
                    this.courseContent.collect = true;
                  } else {
                    this.isCollect = false;
                  }
                  this.check = false;
                }).catch(()=>{
                  this.isCollect = this.courseContent.collect;
                  this.check = false;
                });
              }else {
                this.axios.post('/api/collectD',
                  qs.stringify({ "id" : this.courseContent.id })
                ).then((res) => {
                  //console.log(res.data);
                  if(res.data) {
                    this.isCollect = false;
                    //设置原数据
                    this.courseContent.collect = false;
                  } else {
                    this.isCollect = true;
                  }
                  this.check = false;
                }).catch(()=>{
                  this.isCollect = this.courseContent.collect;
                  this.check = false;
                });

              }
            }
          },1000);
        }

      },
      changeFloat(index) {
        index = index || 0;
        let type = Math.round(Math.random()) ? this.floatLeft : this.floatRight;
        this.$set(this.isFloat,index,type);
      },
      switchChange() {
        if(!this.isProcedure) {
          this.procedureMessage.length = 0;
          this.$set(this.procedureMessage,0,this.countMessage[0]);
        }else {
          this.stepActive = 0;
          this.newStep = 1;
          this.procedureMessage.length = 0;
          for(let i=0;i<this.countMessage.length;i++) {
            this.changeFloat(i);
            this.procedureMessage.push(this.countMessage[i]);
          }
        }

      },
      stepPre() { //stepActive 范围0-4   newStep 范围1-4  stepCount
        if(this.stepActive === 0 ) { return; }
        this.stepActive --;
        this.newStep --;
        //极限小 处理
        if(this.stepActive < 0) {
          this.stepActive = 0;
        }
        if(this.newStep < 1) {
          this.newStep = 1;
        }
        //极限大 处理
        if(this.stepActive === (-1 + this.stepCount)) {
          this.newStep = this.stepCount;
        }
        this.isOver = "下一步";
        this.changeFloat();
        this.$set(this.procedureMessage,0,this.countMessage[this.newStep-1]);

      },
      stepNext() {
        if(this.stepActive === this.stepCount ) { return; }
        this.stepActive ++;
        this.newStep ++;
        //极限小 处理
        if(this.stepActive >= this.stepCount)
        {
          this.newStep = this.stepCount;
        }
        //极限大 处理
        if(this.stepActive > this.stepCount) {
          this.stepActive = this.stepCount;
        }
        if(this.newStep > this.stepCount)
        {
          this.newStep = this.stepCount;
        }
        if(this.stepActive === this.stepCount) {
          this.isOver = "完成";
        }
        else {
          this.isOver = "下一步";
          this.changeFloat();
        }
        this.$set(this.procedureMessage,0,this.countMessage[this.newStep-1]);

      },
      //时间差值
      getDifTime(t) {
        return this.$moment(t,'YYYYMMDDHmm').fromNow();
      },
      getdiscuss(){
        this.axios.get('/api/getdiscuss/'+this.id+'').then((res)=>{
          this.discuss.length = 0;
          this.discussNum = res.data.length;
          this.discuss = res.data;
        }).catch();
      },
      senddiscuss() {
        this.$store.state.mydiscuss = this.mydiscuss;
        if(this.mydiscuss.length < 200 && this.mydiscuss.length !==0 ){
          this.axios.post('/api/discuss',qs.stringify(
            {  "targetid" : this.id ,"targetname" : this.courseContent.name , "content" : this.mydiscuss , "time" : this.$moment().format('YYYYMMDDHmm') })
          ).then(()=>{
            this.mydiscuss = this.$store.state.mydiscuss = "";
            message.success({
              message: '评论成功!'
            });
            this.getdiscuss();
          }).catch(()=>{
            this.mydiscuss = this.$store.state.mydiscuss;
          });
        }else {
          message.error({
            message: '不能超过200字,且不为空'
          });
        }
      }
    },
    components : {
      myVideo,
      headImg
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  procedureMessageWidth = 80%
  procedureMessageMarginLeft = 8%
  procedureImgWrapperWidth = 350px
  procedureImgWrapperHeight = 234px

  .courseContent
    margin-top 10px
    margin-bottom 150px
    .MsgInfo
      background url('../../../../static/bg-c1.jpg')
    .el-card
      border-radius 12px
      margin-bottom 30px
      padding-bottom 0
      .el-card__body
        background rgba(0,0,0,0.5)
        padding 20px 0 0 0
      .el-card__header
        height 50px
        padding 0
        box-shadow 0 0 5px rgba(0,0,0,0.8)
        background #fff
        .header
          height 50px
          line-height 50px
          padding-left 25px
          letter-spacing 2px
          font-size 20px
        .collect
          float right
          margin-right 25px
          .el-checkbox-button__inner
            //background #13CE66
            border 1px solid #999
            border-radius 5px
            margin-bottom 3px
        .check
          .el-checkbox-button__inner
            background #13CE66
        .checked
          .el-checkbox-button__inner
            background #20A0FF
      .message
        padding 0 0 40px 25px
        .content
          margin-right 30px
          margin-bottom 25px
          padding 20px 0 0 20px
          border 2px solid rgba(66,66,66,0.4)
          background rgba(255,255,255,0.9)
          border-radius 20px
          .listImgWrapper
            float left
            width 300px
            height 200px
            overflow hidden
            margin-bottom 20px
            .listImg
              border-radius 15px
              width 300px
          .title
            float left
            padding-left 35px
            width 50%
            .name
              font-size 18px
            .grade
              padding-left 15px
            .author
              padding-left 15px
              color #666
              font-size 14px
            .messageContent
              text-indent 10px
              letter-spacing 1px
              line-height 25px
        .procedure
          margin-bottom 15px
          .step
            margin-top 10px
            vertical-align bottom
            padding 10px
            width 94%
            margin-left 2%
            border 2px solid #aaa
            border-radius 40px
            background rgba(255,255,255,0.9)
            .stepMain
              display inline-block
              text-align center
              width 90%
            .stepBtn
              margin-top 18px
              display inline-block
              text-align center
              cursor pointer
              vertical-align bottom
              width 30px
              height 30px
              line-height 30px
              padding 5px
              border 2px solid rgba(0,0,0,0.4)
              border-radius 50%
              background rgba(0,0,0,0.2)
              color rgba(0,0,0,0.7)
          .procedureMessage
            position relative
            width procedureMessageWidth
            margin-top 80px
            margin-left procedureMessageMarginLeft
            border 3px solid #aaa
            border-radius 20px
            padding 25px
            background rgba(255,255,255,0.9)
            box-sizing border-box
            .procedureImgWrapper
              width procedureImgWrapperWidth
              height procedureImgWrapperHeight
              .procedureImg
                vertical-align bottom
                border-radius 15px
                width 350px
            .procedureContentWrapper
              position relative
              font-size 22px
              float left
              margin-left 5%
              margin-top -20px
              width 50%
              .text
                li
                  font-size 18px
                  line-height 30px
            .nextBtn
              position absolute
              bottom 0
              right 0

        .movie
          width 80%
          padding-right 25px
          margin 0 auto
          margin-top 20px

      .discuss
        .el-collapse-item__content
          border 0
          //border-top 5px #aaa solid
          padding 0
          .el-collapse-item
            padding 0 0 0 10px
        .discussWrapper
          width 100%
          padding-bottom 5px
          border-top 5px #aaa solid
          .disheadimg,.discussContent
            display inline-block
            float left

  @media screen and (max-width: 1540px)
    .courseContent
      .el-card
        .message
          .procedure
            .step
              .stepMain
                width 80%
            .procedureMessage
              .procedureContentWrapper
                width 40%
  @media screen and (max-width: 1330px)
    .courseContent
      .el-card
        .message
          .procedure
            .procedureMessage
              .procedureImgWrapper
                width 280px
                height 210px
                .procedureImg
                  width 280px
  @media screen and (max-width: 1030px)
    .courseContent
      .el-card
        .message
          .procedure
            .procedureMessage
              width : 90%
              margin-left 3%
  @media screen and (max-width: 750px)
    .courseContent
      .el-card
        .message
          .procedure
            .step
              .stepMain
                display none
            .procedureMessage
              width 92%
              padding 3px
              padding-bottom 5px
              margin-left 5px
              .procedureContentWrapper
                padding-bottom 36px
                .h
                  width 220px
                .text
                  width 220px
              .procedureImgWrapper
                display none
              .nextBtn
                right -80px
                bottom 0
</style>
