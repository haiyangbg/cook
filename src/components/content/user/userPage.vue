<template>
  <div class="user">

    <el-row type="flex" justify="center">
      <el-col :span="14">
        <div class="information clearfix" :style="'background-color:'+dataMsg.bg+';'" v-loading.body="userloading">
          <div class="theimg" style="position:absolute; bottom:20px; float: left;">
            <headImg :size="'B'" :url="dataMsg.url"></headImg>
            <div class="headWrapper" v-if="this.id === 0"><span class="headText">点击更换头像</span></div>
          </div>
          <div class="message">
            <div v-if="dataMsg.type + '' !== '0'">
              <el-tooltip effect="dark" :content="userType(dataMsg.type)" placement="top"><!---->
                <i class="iconfont userType" :class="'icon-paiming' + ( 4 - dataMsg.type )"></i>
              </el-tooltip>
            </div>
            <span class="name">{{ dataMsg.name }}</span>
            <span class="iconfont" :class="sex(dataMsg.sex)" style="padding-left: 20px; font-size: 20px;"></span><br>
            <div v-for="(item,key) in dataMsg.msg" class="msgContent" v-if="item">
              <span class="iconfont icon" :class="'icon-'+ key"></span>
              <span v-if="isArray(item)" class="text">{{item}}</span>
              <div v-else class="honorWrapper">
                <span v-for="(hItem,key) in item" class="honor">{{hItem}}</span>
              </div>
              <br>
            </div>
          </div>
          <el-popover ref="popoverBg" placement="bottom" width="60" trigger="click">
            <div style="height: 40px; line-height: 40px;">
              <span style=" vertical-align: top; ">选择封面背景色</span>
              <el-color-picker v-model="dataMsg.bg" @change="setbg"></el-color-picker>
            </div>
            <el-button type="text" style="width: 152px; text-align: center;" @click="changePageBgDialog">修改主页背景</el-button>
          </el-popover>
          <el-button class="changeBg" v-if="this.id === 0" v-popover:popoverBg>修改封面背景</el-button>
          <el-button class="changeBg" v-if="this.id !== 0" @click="followclick(id)" >{{ hasfollow ? '已关注' : '关注' }}</el-button>
          <el-button class="changeMsg" v-if="this.id === 0" @click="reviseDialog = true;">编辑个人信息</el-button>
        </div>
      </el-col>
    </el-row>

    <!--动态内容-->
    <el-row type="flex" justify="center" style="margin-top: 15px;">
      <el-col :span="10" class="informationCol">
        <div class="content">
          <el-tabs type="border-card" :value="mainTabsValue" class="mainTabs" @tab-click="mainTabClick">
            <el-tab-pane v-if="id === 0" label="动态" name="0">
              <el-tabs type="border-card" :value="trendsActionName" class="childTabs" :class="{ 'aboutMeColor' : aboutMe }" @tab-click="aboutMeClick">
                <el-tab-pane class="trends" name="0">
                  <span slot="label">关注动态<i v-if="trendsActionName === '0'" class="iconfont icon-shuaxin refresh" @click="trendsRefresh"></i></span>
                  <div ref="Trends">
                    <template v-for="(item,index) in trends">
                      <information :item="item" :index="index"></information>
                    </template>
                    <myloading :logLoading="logLoading" :AllTrends="AllTrends"></myloading>
                  </div>
                </el-tab-pane>
                <el-tab-pane class="aboutMe" name="1">
                  <span slot="label">与我相关 {{ aboutMe ? aboutMe : ''}}<i v-if="trendsActionName === '1'" class="iconfont icon-shuaxin refresh" @click="aboutMeRefreshClick"></i></span>
                  <div v-for="(item,index) in aboutMsg" class="aboutMeContent">
                    <div class="meTitle" :style="item.isRead !== '0' ? 'background : #ddd;' : ''">{{ aboutMeTitle(item.type,item.isRead) }}<span style="float: right; padding-right: 10px;">{{ getDifTime(item.time) }}</span></div>
                    <div class="meContent clearfix" :style="item.isRead !== '0' ? 'background : #eee;' : ''">
                      <span class="meContentText">{{ aboutMeContent(item) }}</span>
                      <el-button @click="setinfo(item.targetId,item.aboutMeId)" v-if="item.type !== '2'" type="info" class="meContentBtn">查看详情</el-button>
                    </div>
                  </div>
                  <myloading :Myclick="getAboutMeRead" :logLoading="aboutMeloading" :AllTrends="aboutMeAll" :LoadedText="aboutMeText" style="font-size: 16px;"></myloading>
                </el-tab-pane>
              </el-tabs>
            </el-tab-pane>
            <el-tab-pane :label="this.id === 0 ? '我的关注' : '他的关注'" name="1" class="followMain">
              <el-tabs type="border-card" :value="followTabsValue" class="childTabs" @tab-click="followClick">
                <el-tab-pane :label="this.id === 0 ? '我关注的' : '他关注的'" name="0">
                  <div class="follow">
                    <div v-for="(item,index) in follow" class="followItem clearfix">
                      <div @click="toUser(item.id)" style="float: left; margin-right: 15px;" >
                        <headImg :size="'S'" :url="item.url"></headImg>
                      </div>
                      <div class="followContent">
                        <div class="followTitle">
                          <span class="followName" @click="toUser(item.id)">{{ item.name }}</span>
                          <div class="followAttr" style="display: inline-block;">
                            <span class="iconfont followSex" :class="sex(item.sex)"></span>
                            <el-tooltip v-if="item.type > 1" effect="dark" :content="userType(item.type)" placement="top">
                              <i class="iconfont followType" :class="'icon-paiming' + ( 4 - item.type )"></i>
                            </el-tooltip>
                          </div>
                        </div>
                        <div class="followSkill">
                          <span class="followSkillTitle">擅长 : </span>
                          <span class="followSkillContent">
                            <span v-for="(item,index) in item.skill" style="padding-right: 8px;">{{ item }}</span>
                          </span>
                        </div>
                        <div class="followBtn" v-if="id === 0" @click="followD(item.id,getFollowMsg)" @mouseenter="BtnEnter(index,followBtnWord)" @mouseleave="BtnLeave(index,followBtnWord)">{{ followBtnWord[index] ? '取消关注' : '已关注'}}</div>
                      </div>
                    </div>
                    <myloading :logLoading="followloading" :AllTrends="followAll"
                               :LoadedText="'您还没关注任何人'" style="font-size: 16px;"></myloading>
                  </div>
                </el-tab-pane>
                <el-tab-pane :label="this.id === 0 ? '关注我的' : '关注他的'" name="1">
                  <div class="follow">
                    <div v-for="(item,index) in henchman" class="followItem clearfix">
                      <div style="float: left; margin-right: 15px;"  @click="toUser(item.id)">
                        <headImg :size="'S'" :url="item.url"></headImg>
                      </div>
                      <div class="followContent">
                        <div class="followTitle">
                          <span class="followName" @click="toUser(item.id)">{{ item.name }}</span>
                          <span class="iconfont followSex" :class="sex(item.sex)"></span>
                          <el-tooltip v-if="item.type > 1" effect="dark" :content="userType(item.type)" placement="top">
                            <i class="iconfont followType" :class="'icon-paiming' + ( 4 - item.type )"></i>
                          </el-tooltip>
                        </div>
                        <div class="followSkill">
                          <span class="followSkillTitle">擅长 : </span>
                          <span class="followSkillContent">
                            <span v-for="(item,index) in item.skill" style="padding-right: 8px;">{{ item }}</span>
                          </span>
                        </div>
                      </div>
                    </div>
                    <myloading :logLoading="henchamenloading" :AllTrends="henchamenAll"
                               :LoadedText="'还没有人关注您'" style="font-size: 16px;"></myloading>
                  </div>
                </el-tab-pane>
              </el-tabs>
            </el-tab-pane>
            <el-tab-pane :label="this.id === 0 ? '我的教程' : '他的教程'" name="2" class="myCourse">
              <el-tabs type="border-card" class="childTabs" :value="mycourseTabsValue" @tab-click="myCourseClick">
                <el-tab-pane label="图文" name="0">
                  <div class="upload" v-if="this.id === 0">上传教程</div>
                  <template v-for="(item,index) in myCourseWord">
                    <information :item="item" :index="index" :isMyself="id === 0"></information>
                  </template>
                  <myloading :logLoading="true" :AllTrends="myallcourseW"
                             :LoadedText="myCourseWord.length !== 0 ? '已加载全部': this.id === 0 ? '您还没发表该类型的教程呢,快来发布吧' : '他还没发表改类型的教程'"></myloading>
                </el-tab-pane>
                <el-tab-pane label="视频" name="1">
                  <div class="upload" v-if="this.id === 0">上传教程</div>
                  <template v-for="(item,index) in myCourseMovie">
                    <information :item="item" :index="index" :isMyself="id === 0"></information>
                  </template>
                  <myloading :logLoading="true" :AllTrends="myallcourseM"
                             :LoadedText="myCourseMovie.length !== 0 ? '已加载全部': this.id === 0 ? '您还没发表该类型的教程呢,快来发布吧' : '他还没发表改类型的教程'"></myloading>
                </el-tab-pane>
              </el-tabs>
            </el-tab-pane>
            <el-tab-pane :label="this.id === 0 ? '我的收藏' : '他的收藏'" name="3" class="collect">
              <template v-for="(item,index) in myCollect">
                <div class="myCollect clearfix">
                 <div v-if="item.img" @click="toContent(item.id)" class="collectImg" v-lazy:background-image="item.img"></div> <!--:style="'background-image: url('+item.img+')'"-->
                  <div v-else @click="toContent(item.id)" class="collectImg" style="background-image: url('/static/error.png'); background-size: contain; background-repeat: no-repeat;"></div>
                  <div class="collectContent">
                    <span class="collectTitle" @click="toContent(item.id)">{{ item.title }}</span><span class="collectAuthor" @click="toUser(item.authorid)">作者 : {{ item.author }}</span>
                    <span v-if="!item.type" class="collectType"><i class="iconfont icon-tuwen" style="padding-right: 5px; font-size: 21px;"></i>图文</span>
                    <span class="collectType" v-else><i class="iconfont icon-shipin" style="padding-right: 5px; font-size: 21px;"></i>视频</span><br>
                    <p class="collectText" @click="toContent(item.id)" :class="{'textContentAfter' : (item.content + '').length > 69}">{{ item.content }}</p>
                  </div>
                  <div class="collectBtn" @click="collectD(item.id)" @mouseenter="BtnEnter(index,collectBtnWord)" @mouseleave="BtnLeave(index,collectBtnWord)">{{ collectBtnWord[index] ? '取消收藏' : '已收藏'}}</div>
                </div>
              </template>
              <myloading :logLoading="true" :AllTrends="mycollectAll"
                         :LoadedText="myCollect.length !== 0 ? '已加载全部': this.id === 0 ? '您还没收藏呢，快去收藏吧' : '他还没有收藏'" style="font-size: 16px;"></myloading>
            </el-tab-pane>
          </el-tabs>
        </div>
      </el-col>
      <el-col :span="4" class="hintCol">
        <div class="hint clearfix">
          <div class="follow" @click="hintFollowClick">
            <div class="name">{{ id === 0 ? '我关注的' : '他关注的' }}</div>
            <div class="hintContent">{{ dataMsg.follow }}</div>
          </div>
          <div class="leader" @click="hintHenchmanClick">
            <div class="name">{{ id === 0 ? '关注的我' : '关注的他' }}</div>
            <div class="hintContent">{{dataMsg.henchman}}</div>
          </div>
        </div>
      </el-col>
    </el-row>
    <!--个人资料弹出框-->
    <el-dialog title="个人资料" :visible.sync="reviseDialog" size="tiny">
      <el-form :model="dialogMessage" :rules="rules" ref="msgForm" label-width="80px" label-position="right">
        <el-form-item label="昵称" prop="name">
          <el-input placeholder="请输入内容" v-model="dialogMessage.name"></el-input>
        </el-form-item>
        <el-form-item label="性别">
          <el-radio-group v-model="dialogMessage.sex">
            <el-radio :label="'男'">男</el-radio>
            <el-radio :label="'女'">女</el-radio>
            <el-radio :label="''">保密</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="擅长">
          <el-select v-model="dialogMessage.skill" multiple placeholder="请选择">
            <el-option v-for="item in skillOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="荣誉">
          <el-input placeholder="请输入内容" v-model="newMessage.newHonor" :disabled="dialogMessage.honor.length >= 10">
            <el-button slot="append" icon="plus" @click="honorAdd" :disabled="dialogMessage.honor.length >= 10"></el-button>
          </el-input>
          <el-tag style="margin-right: 5px;" :key="tag" v-for="tag in dialogMessage.honor"
                  :closable="true" :close-transition="false" @close="tagClose(tag)" type="success"> {{tag}}
          </el-tag>
        </el-form-item>
        <el-form-item label="邮箱" prop="Email">
          <el-input placeholder="请输入内容" v-model="dialogMessage.Email"></el-input>
        </el-form-item>
        <el-form-item label="自我介绍" prop="introduce">
          <el-input type="textarea" :autosize="{ minRows: 1, maxRows: 5}" placeholder="请输入内容" v-model="dialogMessage.introdice"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="reviseDialog = false">取 消</el-button>
        <el-button type="primary" @click="submitMsg('msgForm')">确 定</el-button>
      </div>
    </el-dialog>
    <!--更换背景弹出框-->
    <el-dialog title="选择背景" :visible.sync="PageDialog" size="small">
      <div class="imgList clearfix" v-loading="imgListLoading" element-loading-text="拼命加载中">
        <div v-for="(item,index) in pageBgList" v-lazy:background-image="item" class="bgImg" @click="changePageBg(item)"><!--:style="'background-image: url('+item+');'" -->
          <div v-if="dataMsg.pagebg === item" class="isBgWrapper"><span class="isBg"><i class="el-icon-check"></i>已选择</span></div>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="PageDialog = false">取 消</el-button>
        <el-button type="primary" @click="setpagebg">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script type="text/ecmascript-6">
  import qs from 'qs'
  import myloading from './loading.vue'
  import information from '.././user/information.vue'
  import headImg from '.././user/headimg.vue'
  import Vue from 'vue'

  import ElButton from 'element-ui/lib/button'
  import ElTabs from 'element-ui/lib/tabs'
  import ElTabPane from 'element-ui/lib/tab-pane'
  import ElDialog from 'element-ui/lib/dialog'
  import ElForm from 'element-ui/lib/form'
  import ElFormItem from 'element-ui/lib/form-item'
  import ElOption from 'element-ui/lib/option'
  import ElTag from 'element-ui/lib/tag'
  import ElInput from 'element-ui/lib/input'
  import ElPopover from 'element-ui/lib/popover'
  import ElColorPicker from 'element-ui/lib/color-picker'
  import ElTooltip from 'element-ui/lib/tooltip'
  import message from 'element-ui/lib/message'
  import ElRadioGroup from 'element-ui/lib/radio-group'
  import ElRadio from 'element-ui/lib/radio'
  import { Loading } from 'element-ui'

  Vue.use(ElButton)
  Vue.use(ElTabs)
  Vue.use(ElTabPane)
  Vue.use(ElDialog)
  Vue.use(ElForm)
  Vue.use(ElFormItem)
  Vue.use(ElOption)
  Vue.use(ElTag)
  Vue.use(ElInput)
  Vue.use(ElPopover)
  Vue.use(ElColorPicker)
  Vue.use(ElTooltip)
  Vue.use(ElRadioGroup)
  Vue.use(ElRadio)
  Vue.use(Loading)

  export default {
    data() {
      let validatorName = (rule, value, callback)=>{
        value = (value + '').trim();
        if(value.length >20 || value.length === 0)
        {
          callback("用户名必须小于20位，且不能为空");
        }else {
          callback();
        }
      };
      let validatorIntroduce = (rule, value, callback)=>{
        value = (value + '').trim();
        if(value.length > 200)
        {
          callback("简介必须小于200");
        }else {
          callback();
        }
      };
      return {
        //id : this.$store.state.userid, //this.$route.query.id ? this.$route.query.id : 0,
//      第一次加载的所有的数据  type 1 普通用户 3  金牌 2  签约  1 认证   msg个人信息 trends 动态   //type 0图文 1视频
        dataMsg : { "name" : "","sex" : "","type": 0 ,"url":"","bg":"","pagebg" : "","henchman" : "" ,"follow" : "","aboutMe": "",
          "msg" : { "skill" : [] , "honor" : [] , "Email" : "","phone" : "" ,"address" : "" ,"introdice":"" },
        },
        trends : [] ,
        //wom 0 1 2  man 0 1 2
        reviseDialog : false,      //修改个人信息界面
        PageDialog : false ,       //修改页面背景界面
        //username : "",
        dialogMessage : {"name" : "" , "sex" : "" , "skill" : [] , "honor" : [] , "Email" : "" ,"address" : "" ,"introdice":""},  //个人信息界面Dialog信息
        skillOptions : [ {value: '中餐',label: '中餐'}, {value: '西餐',label: '西餐'}, { value: '糕点', label: '糕点' }, { value: '黑暗料理', label: '黑暗料理' }], //特长所有分类
        newMessage : { //个人信息界面 修改信息暂时缓存
          newHonor : ""   //新增的荣誉
        },
        rules: {      //表单验证规则
          Email: [    //email验证规则
            { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur,change' }
          ],
          name: [
            { validator: validatorName, trigger: 'change,blur'}
          ],
          introduce : [
            { validator: validatorIntroduce, trigger: 'blur'}
          ]
        },
        headImgBg : "#eeeeee",   //默认背景色
        imgListLoading : true,   //修改页面背景界面 加载状态
        pageBgList : [],         //修改页面背景界面 图片集合
        ///////主体信息
        //main tabs 默认选择哪个
        mainTabsValue :  '0', //this.$store.state.userIndex,
        //trends tabs 选择哪个
        trendsActionName : '0', //this.$store.state.usertrendselect,
        //follow tabs 选择哪个
        followTabsValue : '0', //this.$store.state.userfollow,
        //mycourse tabs 选择哪个
        mycourseTabsValue: '0', //this.$store.state.usercourse,
        //是否正在刷新
        isLoading : [[]],

        aboutMe : 0 ,              //和我相关
        aboutMsg :[{ "aboutMeId" : "","type": 0 , "time" : "12" , "sourceId" : "" , "sourceName" : "" , "targetId" : "" , "targetName" : "" , "content" : "" }],
        // type 0 评论被回复 1 自己的教程被评论 2 被人关注   sourceId 谁 call me   sourceName 那个人的用户名   targetId  教程id  targetName 教程标题  content 具体内容
        isRead : [],
        //哪些<关于我>被阅读了
        //我关注了谁
        follow : [ { "id" : "" , "type": 0 , "sex" : ""  , "url" : "" , "name" : "" , "skill" : [] ,"time" : "" }],
        //谁关注了我
        henchman : [ { "id" : "" , "type": 0 , "sex" : "" , "url" : "" , "name" : "" , "skill" : [] ,"time" : "" }],
        //按钮字体状态
        followBtnWord : [],
        //收藏
        myCourseWord : [{}],
        myCourseMovie : [{}],
        myCollect : [{}],
        collectBtnWord : [], //collect按钮状态

        //动态正在加载的显示框 是否显示
        logLoading : false,
        //是否加载所有动态 ?
        AllTrends : false,
        //现在是第几页动态
        newTrendsIndex : 1,
        //是否可以滚动加载动态
        TrendsLoading : true,
        //动态加载
        loadingT : true,
        //是否已经有了滚动加载事件
        addScrollFlag : true,

        //我的教程是否全部加载完成
        //图文
        myallcourseW : false,
        //视频
        myallcourseM : false,
        //收藏加载完成？
        mycollectAll : false,

        //是否正在加载
        aboutMeloading : true,
        aboutMeAll : false,
        aboutMeReadAll : false,

        followloading : true,
        henchamenloading : true,
        followAll : false,
        henchamenAll : false,

        userloading : false,

        hasfollow : false
      }
    },
    created() {
      if(this.$store.state.userTrendsTop === 0)
      {
        window.scrollTo(0,0);
      }
      document.body.style.backgroundImage = "url('/static/user/user-bg1.jpg')";
      document.body.style.backgroundAttachment = 'fixed';
      document.body.style.backgroundSize = 'cover';
      document.body.style.overflow = 'auto';
      this.trends.length = 0;
      this.follow.length = 0;
      this.henchman.length = 0;
      this.myCourseWord.length = 0;
      this.myCourseMovie.length = 0;
      this.myCollect.length = 0;
      this.aboutMsg.length = 0;
      if(this.id === 0) {
        this.mainTabsValue = this.$store.state.userIndex;
        this.trendsActionName = this.$store.state.usertrendselect;
        this.followTabsValue = this.$store.state.userfollow;
        this.mycourseTabsValue = this.$store.state.usercourse;
        this.getuser();
        this.mainTabClick(this.mainTabsValue);
        window.addEventListener('scroll', this.handleScroll,false);
        this.addScrollFlag = false;
      }else {
        this.mainTabsValue = this.$store.state.userIndexid = '2';
        this.followTabsValue = this.$store.state.userfollowid = '0';
        this.mycourseTabsValue = this.$store.state.usercourseid = '0';
        this.getuserid();
        this.isfollow(this.id);
        this.mainTabClick(this.mainTabsValue);
      }
    },
    computed :{
      aboutMeText() {
        let text = this.aboutMsg.length !== 0 ? '已加载全部,点击加载历史消息':'还没有未阅读消息,点击加载历史消息';
        return this.aboutMeReadAll ? '已加载全部' : text;
      },
      id() {
        return this.$store.state.userid;
      }
    },
    methods : {
      setinfo(targetId,aboutMeId) {
        this.axios.get('/api/setread/'+aboutMeId+'').then((res)=>{}).catch();
        this.toContent(targetId)
      },
      followclick(id) {
        if(this.hasfollow){
          this.followD(id);
        }else {
          this.followA(id);
        }
      },
      followD(id,callback) {
        this.axios.post('/api/deletefollow',qs.stringify({ "id" : id })).then((res)=>{
          if(res.data && this.id !==0 ) {
            this.hasfollow = !this.hasfollow;
          }
          if(callback)
          {
            callback();
          }
        }).catch();
      },
      followA(id) {
        this.axios.post('/api/addfollow',qs.stringify({ "id" : id , "time" : this.$moment().format('YYYYMMDDHmm') })).then((res)=>{
          //console.log(res.data);
          if(res.data) {
            this.hasfollow = !this.hasfollow;
          }
        }).catch();
      },
      isfollow(id){
        this.axios.get('/api/isfollow/'+id+'').then((res)=>{
          this.hasfollow = res.data;
        }).catch(()=>{

        });
      },
      collectD(id) {
        this.axios.post('/api/collectD',qs.stringify({ "id" : id })).then((res)=>{
          this.getMyCollect();
        }).catch();
      },
      getuser(){
        this.userloading =true;
        this.axios.get('/api/user').then((res) => {
          if(res.data === null) {
            this.expire();
          }
          else {
            this.dataMsg = res.data;
            this.dataMsg.type = res.data.type;
            if(this.dataMsg.pagebg) {
              document.body.style.backgroundImage = "url('"+this.dataMsg.pagebg+"')";
            }
            this.aboutMe = this.dataMsg.aboutMe;
            for(let i in this.dataMsg.msg) {
              if(typeof this.dataMsg.msg[i] === "object" && this.dataMsg.msg[i][0] === "") {
                this.dialogMessage[i] = [];
              }else {
                this.dialogMessage[i] = this.dataMsg.msg[i];
              }
            }
            this.dialogMessage.name = this.dataMsg.name;
            this.dialogMessage.sex = this.dataMsg.sex.trim();
            this.dialogMessage.introdice = this.dataMsg.msg.introdice;
            this.dialogMessage.Email = this.dataMsg.msg.email;
            this.userloading =false;
          }
        }).catch(()=>{ this.expire(); });
      },
      getuserid(){
        this.userloading =true;
        this.axios.get('/api/user/'+this.id+'').then((res) => {
          this.dataMsg = res.data;
          if(this.dataMsg.pagebg) {
            document.body.style.backgroundImage = "url('"+this.dataMsg.pagebg+"')";
          }
          this.aboutMe = this.dataMsg.aboutMe;
          this.dataMsg.type = res.data.type;

          this.userloading =false;
        }).catch(()=>{ this.expire(); });
      },
      //高度不够加载下一页
      loadingHeight() {
        //运动定时器
        let time;
        if(document.body.scrollHeight < this.$store.state.userTrendsTop) {
          this.myMove(time,document.body.scrollHeight);// - document.documentElement.clientHeight
        }else {
          this.myMove(time,this.$store.state.userTrendsTop);
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
      //滚动记住位置
      remSrcoll() {
        if(this.$route.path !== "/user" || this.trendsActionName !=='0' ) {
          window.removeEventListener('scroll', this.remSrcoll,false);
          this.hasAddRemScroll = false;
        }else{
          this.$store.state.userTrendsTop = window.pageYOffset;
        }
        //console.log(this.$store.state.userTrendsTop);
      },
      //滚动加载
      handleScroll(){
        if(this.$route.path !== "/user" || this.trendsActionName !=='0' || this.$store.state.userid !== 0) {
          window.removeEventListener('scroll', this.handleScroll,false);
          this.addScrollFlag = true;
        }else {
          if(!this.logLoading) {
            let scrollTop = window.pageYOffset + document.documentElement.clientHeight;
            let trendsHeight = this.$refs["Trends"].getBoundingClientRect().height;
            if( scrollTop >= trendsHeight ) {
              this.getTrends(this.newTrendsIndex);
            }
          }
        }
      },
      //token过期处理
      expire() {
        this.$store.state.tokenStatus = false;
        this.toLogin();
        message.error({
          message: '登录过期请重新登录'
        });
      },
      //判断是不是默认头像 true 是默认头像  false 不是默认头像
      isDefaultHeadImg(Imgurl) {
        let url = (Imgurl + '').slice(0,3);
        if(url === "man" || url === "wom") {
          return true;
        }
        else {
          return false;
        }
      },
      //根据性别显示性别图标
      sex(sex) {
        return sex ? (sex === '男' ? 'icon-sexm' : 'icon-sexw') : 'icon-sex';
      },
      userType(t) {
        let msg = '';
        t = t +'';
        switch(t) {
          case '1' :
            msg = "";
            break;
          case '2' :
            msg = "认证大厨";
            break;
          case '3' :
            msg = "Cooking大厨";
            break;
          case '4' :
            msg = "Cooking金牌";
            break;
        }
        return msg;
      },
      tagClose(tag) {
        this.dialogMessage.honor.splice(this.dialogMessage.honor.indexOf(tag), 1);
      },
      honorAdd() {
        //console.log(this.newHonor);
        if(!this.newMessage.newHonor) {
          this.$message({
            message: '不可以为空',
            type: 'error'
          });
          return ;
        }
        if(this.dialogMessage.honor.indexOf(this.newMessage.newHonor) === -1) {
          this.dialogMessage.honor.push(this.newMessage.newHonor);
        }
        else {
          this.$message({
            message: '已添加过该内容',
            type: 'error'
          });
        }
        this.newMessage.newHonor = "";
      },
      //修改个人信息表单提交
      submitMsg(formName) {
        this.$refs[formName].validate((flag) => {
          if (flag) {
            //console.log(this.dialogMessage);
            let info = this.dialogMessage;
            info.skill = info.skill.join(',');
            info.honor = info.honor.join(',');
            this.axios.post('api/setInfo',qs.stringify(info)).then((res)=>{
              this.reviseDialog = false;
              this.getuser();
            }).catch(()=>{

            });
          } else {
            return false;
          }
        });
      },
      isArray(o) {
        return Object.prototype.toString.call(o) !== '[object Array]'; //true 表示不是数组
      },
      //背景图片
      changePageBgDialog() {
        this.PageDialog = true;
        this.imgListLoading = true;
        this.axios.get('/api/bg').then( (res)=> {
          this.pageBgList = res.data;
          this.imgListLoading = false;
        }).catch();
      },
      changePageBg(url) {
        this.dataMsg.pageBg = url;
        document.body.style.backgroundImage = "url("+url+")";
      },
      setpagebg() {
        this.axios.post('/api/setpagebg', qs.stringify({ "pagebg" : this.dataMsg.pageBg })).then((res)=>{
          //console.log(res.data)
        }).catch();
      },
      setbg() {
        setTimeout(()=>{
          this.axios.post('/api/setbg',qs.stringify({ "bg" : this.dataMsg.bg })).then((res)=>{
            //console.log(res.data)
          }).catch();
        },1000)
      },
      //<动态><关于我>的点击事件 0动态 1关于我
      aboutMeClick(tabs) {
        this.trendsActionName = tabs.name;
        this.$store.state.usertrendselect = tabs.name;
        if(tabs.name === '1'){
          window.removeEventListener('scroll', this.handleScroll,false);
          this.addScrollFlag = true;
          try{
            if(!this.aboutMsg.length) {
              this.getAboutMe();
            }
          }catch(e) {}
        }else {
          if( this.trends.length === 0 ){
            this.getTrends();
          }
          if(this.addScrollFlag) {
            window.addEventListener('scroll', this.handleScroll,false);
            this.addScrollFlag = false;
          }
          //清除部分关于我的信息
          this.clearHenchman();
        }
      },
      /////////////////////拿数据
      //获取<动态>数据
      getTrends() {
        //现在不可以滚动加载动态
        this.logLoading = false;
        //打开加载框
        this.logLoading = true;
        this.axios.get('/api/mytrends/'+this.newTrendsIndex+'').then((res) => {
          if(res.data.length !== 0) {
            //console.log(res.data);
            for(let i = 0;i<res.data.length;i++) {
              this.trends.push(res.data[i]);
            }
            //this.trends = res.data; //this.timeSort(res.data);
            this.newTrendsIndex ++ ;
            //加载完成关闭加载框
            this.logLoading = false;
            //是否正在加载(关于滚动是否能触发加载)
            this.TrendsLoading = true;
            /////////////////////是否滚到到上一次的地方了
            this.$nextTick(()=>{
              this.loadingHeight();
            });
          }else {
            //已加载全部
            this.AllTrends = true;
            //显示加载框
            this.logLoading = true;
            //全部加载完毕取消滚动加载事件
            window.removeEventListener('scroll', this.handleScroll,false);
          }
        }).catch(()=>{
          //关闭动态显示框
          this.loadingT = false;
          //关闭加载框
          this.dialogLoading = false;
        });
      },
      //获取<关于我>的数据
      getAboutMe() {
        if(this.aboutMsg.length === 0) {
          this.axios.get('/api/aboutMe').then((res)=>{
            this.aboutMeAll = true;
            //this.aboutMsg = this.timeSort(res.data);
            if(res.data.length !== 0) {
              for(let i=0;i<res.data.length;i++){
                this.aboutMsg.push(res.data[i]);
              }
              this.aboutMe = this.aboutMsg.length;
            }else {
              this.aboutMe = '';
            }
          }).catch();
        }
      },
      //获取<关于我>的数据
      getAboutMeRead() {
        this.axios.get('/api/aboutMeRead').then((res)=>{
          this.aboutMeReadAll = true;
          if(res.data.length !== 0) {
            for(let i=0;i<res.data.length;i++){
              this.aboutMsg.push(res.data[i]);
            }
            //this.aboutMe = this.aboutMsg.length;
          }else {
            this.aboutMe = '';
          }
        }).catch();
      },
      //获取<我关注的>数据
      getFollowMsg(callback) {
        this.axios.get('/api/getfollow').then((res)=>{
          if(res.data.length !== 0) {
            this.followloading = false;
            this.follow = this.timeSort(res.data);
            this.dataMsg.follow = this.follow.length;
          }
          else {
            this.followAll = true;
          }
          if(callback) {
            callback();
          }
        }).catch();
      },
      //获取<关注我的>数据
      getHenchmanMsg(callback) {
        this.axios.get('/api/gethenchman').then((res)=>{
          if(res.data.length !== 0) {
            this.henchamenloading = false;
            this.henchman = this.timeSort(res.data);
            this.dataMsg.henchman = this.henchman.length;
          }
          else {
            this.henchamenAll = true;
          }
          if(callback) {
            callback();
          }
        }).catch();

      },
      //获取<我的教程 -- 图文>的数据
      getMyCourseWord() {
        this.axios.post('/api/mycourse',qs.stringify({ "type" : "0" })).then((res)=>{
          //console.log(res.data);
          this.myCourseWord = this.timeSort(res.data);
          this.myallcourseW = true;
        }).catch(()=>{
          this.myCourseWord.length = 0;
          this.myallcourseW = true;
        });
      },
      //获取<我的教程 -- 视频>的数据
      getMyCourseMovie() {
        this.axios.post('/api/mycourse',qs.stringify({ "type" : "1" })).then((res)=>{
          this.myCourseMovie = this.timeSort(res.data);
          this.myallcourseM = true;
        }).catch(()=>{
          this.myCourseMovie.length = 0;
          this.myallcourseM = true;
        });
      },
      //获取<我的收藏>的数据
      getMyCollect() {
        this.axios.get('/api/mycollect').then((res)=>{
          //console.log(res.data);
          this.myCollect = this.timeSort(res.data);
          this.mycollectAll = true;
        }).catch();
      },
      //<动态>刷新按钮
      trendsRefresh() {
        this.newTrendsIndex = 1;
        this.trends.length = 0;
        this.AllTrends = false;
        this.getTrends();
        this.$message({
          message: '刷新成功 ! ',
          type: 'success'
        })
      },
      //<关于我>刷新按钮
      aboutMeRefreshClick() {
        this.aboutMeReadAll = false;
        this.clearHenchman();
        //异步请求改aboutMe，再请求
        //this.getAboutMe();
        this.MessageOpen();
      },
      //时间差值
      getDifTime(t) {
        return this.$moment(t, 'YYYYMMDDHmm').fromNow();
      },
      //按时间给 数据排序 （数组里的对象必须有time属性）
      timeSort(arr) {
        if (arr.length <= 1) { return arr; }
        let pivotIndex = Math.floor(arr.length / 2);
        let pivot = arr.splice(pivotIndex, 1)[0];
        let left = [];
        let right = [];
        for (let i = 0; i < arr.length; i++){
          if (arr[i].time > pivot.time) {
            left.push(arr[i]);
          } else {
            right.push(arr[i]);
          }
        }
        return this.timeSort(left).concat([pivot], this.timeSort(right));
      },
      //根据不同的aboutMe type 返回不同的值
      aboutMeTitle(t,isread) {
        let type = t +'';
        if(isread === '0')
        {
          switch(type) {
            case '0':
              return '评论有新的回复';
            case '1':
              return '教程有新的评论';
            case '2':
              return '新的关注';
          }
        }else {
          switch(type) {
            case '0':
              return '评论的回复';
            case '1':
              return '教程的评论';
            case '2':
              return '关注';
          }
        }

      },
      aboutMeContent(obj) {
        let type = obj.type +'';
        switch(type) {
          case '0':
            return ' ( ' + obj.sourceName + ' ) ' + ' 对你在教程 : < ' + obj.targetName + ' > 的评论进行了回复 : “ ' +  obj.content + " ”";
          case '1':
            return ' ( ' + obj.sourceName + ' ) ' + ' 对你的教程 : < ' + obj.targetName + ' > 进行了评论 : “ ' +  obj.content + " ”";
          case '2':
            return ' ( ' + obj.sourceName + ' ) ' + ' 关注了你';
        }
      },
      //清除来自<关注>的信息
      clearHenchman() {
        for(let i = this.aboutMsg.length - 1;i >= 0 ; i-- ) {
          if(this.aboutMsg[i].type === '2') {
            //this.isRead.push(this.aboutMsg[i].aboutMeId);
            this.aboutMsg.splice(i,1);
          }
        }
        this.aboutMe = this.aboutMsg.length;
        //异步请求

      },
      //<关注>的点击事件
      followClick(tabs) {
        this.$store.state.userfollow = tabs.name;
        if(tabs.name === '0') {
          if(this.id===0) {
            this.getFollowMsg();
          }else {
            this.getFollowMsgid();
          }
        }else { //henchman
          if(this.id===0) {
            this.getHenchmanMsg();
          }else {
            this.getHenchmanMsgid();
          }
        }
      },
      //<我的教程>的点击事件
      myCourseClick(tabs) {
        this.$store.state.usercourse = tabs.name;
        if(tabs.name === '0') {
          if(!this.myCourseWord.length) {
            this.getMyCourseWord();
          }
        }else {
          if(!this.myCourseMovie.length) {
            this.getMyCourseMovie();
          }
        }
      },
      //主tab的click事件
      mainTabClick(tabs) {
        let index = tabs.name ? tabs.name : this.mainTabsValue;
        if(this.id===0) {
          this.$store.state.userIndex = index;
        }else {
          this.$store.state.userIndexid = index;
        }
        if(index === '0') {
          if(this.trendsActionName === '0') {
            if(!this.trends.length) {
              this.getTrends();
            }
          }else {
            if(!this.aboutMsg.length) {
              this.getAboutMe();
            }
          }

        }else if(index === '1' ) {
          if(this.followTabsValue ==='0') {
            //我关注的
            this.hintFollowClick();
            /*if(!this.follow.length) {
              //this.getFollowMsg();
              this.hintFollowClick();
            }*/
          }else {
            //关注我的
            this.hintHenchmanClick();
            /*if(!this.henchman.length) {
              //this.getHenchmanMsg();
              this.hintHenchmanClick();
            }*/
          }
        }else if(index === '2'){
          //console.log(this.mycourseTabsValue);
          if(this.mycourseTabsValue === '0') {
            //图文教程
            if(this.id===0) {
              if(!this.myCourseWord.length) {
                this.getMyCourseWord();
              }
            }else {
              this.getMyCourseWordid();
            }
          }
          else {
            //视频教程
            if(this.id===0) {
              if(!this.myCourseMovie.length){
                this.getMyCourseMovie();
              }
            }else {
              this.getMyCourseMovieid();
            }

          }
        }else if(index === '3'){
          if(!this.myCollect.length) {
            if(this.id===0) {
              this.getMyCollect();
            }else {
              this.getMyCollectid();
            }
          }
        }
      },
      //弹窗
      MessageOpen() {
        this.$message({
          message: '刷新成功 ! ',
          type: 'success'
        });
      },
      //按键鼠标焦点事件
      BtnEnter(index,arr) {
        this.$set(arr,index,'focus');
      },
      BtnLeave(index,arr) {
        this.$set(arr,index,'');
      },
      //我关注的点击事件
      hintFollowClick() {
        if(this.id === 0) {
          this.getFollowMsg(() => {
            this.mainTabsValue = this.$store.state.userIndex = '1';
            this.followTabsValue = this.$store.state.userfollow = '0';
          });
        }else {
          this.getFollowMsgid(() => {
            this.mainTabsValue = this.$store.state.userIndexid = '1';
            this.followTabsValue = this.$store.state.userfollowid = '0';
          });
        }

      },
      //关注我的点击事件
      hintHenchmanClick() {
        if(this.id === 0) {
          this.getHenchmanMsg(() => {
            this.mainTabsValue = this.$store.state.userIndex = '1';
            this.followTabsValue = this.$store.state.userfollow = '1';
          });
        }else {
          this.getHenchmanMsgid(() => {
            this.mainTabsValue = this.$store.state.userIndexid = '1';
            this.followTabsValue = this.$store.state.userfollowid = '1';
          });
        }
      },
      //获取<我关注的>数据
      getFollowMsgid(callback) {
        this.axios.get('/api/getfollow/'+this.id+'').then((res)=>{
          if(res.data.length !== 0) {
            this.followloading = false;
            this.follow = this.timeSort(res.data);
            this.dataMsg.follow = this.follow.length;
          }
          else {
            this.followAll = true;
          }
          if(callback) {
            callback();
          }
        }).catch();
      },
      //获取<关注我的>数据
      getHenchmanMsgid(callback) {
        this.axios.get('/api/gethenchman/'+this.id+'').then((res)=>{
          if(res.data.length !== 0) {
            this.henchamenloading = false;
            this.henchman = this.timeSort(res.data);
            this.dataMsg.henchman = this.henchman.length;
          }
          else {
            this.henchamenAll = true;
          }
          if(callback) {
            callback();
          }
        }).catch();

      },
      //获取<我的教程 -- 图文>的数据
      getMyCourseWordid() {
        this.axios.post('/api/courseid',qs.stringify({ "id": this.id , "type" : "0" })).then((res)=>{
          this.myCourseWord = this.timeSort(res.data);
          this.myallcourseW = true;
        }).catch();
      },
      //获取<我的教程 -- 视频>的数据
      getMyCourseMovieid() {
        this.axios.post('/api/courseid',qs.stringify({ "id": this.id ,"type" : "1" })).then((res)=>{
          this.myCourseMovie = this.timeSort(res.data);
          this.myallcourseM = true;
        }).catch(()=>{
          this.myallcourseM = true;
        });
      },
      //获取<我的收藏>的数据
      getMyCollectid() {
        this.axios.get('/api/collectid/'+this.id+'').then((res)=>{
          //console.log(res.data);
          this.myCollect = this.timeSort(res.data);
          this.mycollectAll = true;
        }).catch();
      }


    },
    components: {
      information,
      headImg,
      myloading
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import '../../.././assets/css/iconfont.css'
  trendsBorderStyle = 1px solid #ddd
  informationBgColor = #fff

  tabsAboutMeTop = #e3fcd6

  .user
    textarea
      resize none
    .information
      border 1px solid #999
      border-radius 10px
      margin-top 15px
      background informationBgColor
      position relative
      width 100%
      height 220px
      padding 20px
      .Bg
        position absolute
        top 0
        left 0
        width 100%
        height 185px
        background #ccc
        border-radius 8px 8px 0 0
        transition all 0.4s
        z-index 0
      .isBg
        height 250px
        background-repeat no-repeat
        background-size cover
      .wrapper
        position absolute
        height 185px
        width 100%
        bottom 0
        left 0
        background #fff
        border-radius 0 0 8px 8px
        z-index 0
      .headWrapper
        width 100%
        height 100%
        border-radius 50%
        overflow hidden
        z-index 100
        position absolute
        text-align center
        top 0
        left 0
        background transparent
        color transparent
        cursor pointer
        transition all 0.3s
        &:hover
          background rgba(0,0,0,0.3)
          color #ddd
        .headText
          display inline-block
          padding-top 90px
          font-size 18px
      .message
        position absolute
        overflow hidden
        bottom 20px
        left 260px
        float left
        width 40%
        height 150px
        .userType
          width 30px
          height 30px
          font-size 30px
          position absolute
          right 1%
          top 5px
        .name
          font-size 24px
          font-weight bold
          letter-spacing 2px
        .msgContent
          font-size 0
          margin-top 9px
          height 30px
          line-height 30px
          .icon
            display inline-block
            font-size 20px
            width 24px
            height 30px
            text-align center
            vertical-align top
            line-height 30px
          .text
            height 30px
            line-height 30px
            overflow hidden
            text-overflow ellipsis
            word-wrap break-word
            display inline-block
            font-size 16px
          .honorWrapper
            display inline-block
            width 80%
            white-space nowrap
            text-overflow ellipsis
            overflow hidden
            font-size 16px
            .honor
              padding-right 10px
              height 30px
              line-height 30px
              font-size 16px
      .changeBg
        position absolute
        right 20px
        top 20px
        border 1px solid #888
        padding-right 8px
        padding-left 8px
        background none
      .changeMsg
        position absolute
        bottom 20px
        right 20px
        border 1px solid #888
        padding-right 8px
        padding-left 8px
        background none
    .content
      margin-bottom 100px
      width 100%
      .mainTabs
        border-radius 8px
        overflow hidden
        .el-tabs__content
          padding 0
          .childTabs
            border-top none
            .follow
              font-size 0
              .followItem
                position relative
                width 100%
                font-size 0
                padding 8px
                border-top 1px solid #ddd
                border-bottom 1px solid #ddd
                .followHeadImg
                  display inline-block
                  float left
                  height 61px
                  width 61px
                  padding 1px
                  margin-right 15px
                  border 1px solid #888
                  border-radius: 50%
                  overflow hidden
                  background-color #78afa9
                  cursor pointer
                  .fHeadImg
                    display inline-block
                    width 60px
                    height 60px
                .followContent
                  font-size 0
                  width 60%
                  float left
                  .followTitle
                    width 100%
                    font-size 16px
                    height 30px
                    line-height 30px
                    margin-bottom 5px
                    .followName
                      font-weight bold
                      letter-spacing 1px
                      cursor pointer
                      min-width 120px
                      word-wrap break-word
                      overflow hidden
                      text-overflow ellipsis
                      &:hover
                        text-decoration underline
                        cursor pointer
                    .followSex
                      width 20px
                      padding-left 10px
                      font-size 16px
                    .followName,.followSex
                      display inline-block
                      height 30px
                      line-height 30px
                      vertical-align top
                    .followType
                      display inline-block
                      width 30px
                      height 30px
                      line-height 30px
                      font-size 25px
                      margin-left 25px
                      color red
                  .followSkill
                    font-size 16px
                    height 30px
                    line-height 30px
                    .followSkillTitle
                      display inline-block
                      color #999
                      margin-right 6px
                      font-size 15px
                      height 30px
                      line-height 30px
                      vertical-align top
                      margin-bottom 5px
                    .followSkillContent
                      display inline-block
                      width 30%
                      height 30px
                      line-height 30px
                      word-wrap break-word
                      overflow hidden
                      text-overflow ellipsis
                .followBtn
                  display line-height
                  position absolute
                  right 30px
                  top 24px
                  width 100px
                  height 40px
                  border 1px solid #888
                  border-radius 8px
                  background #ddd
                  font-size 16px
                  text-align center
                  box-sizing border-box
                  padding-top 8px
                  vertical-align middle
                  color #666
                  cursor pointer
                  &:hover
                    background #aaa
                    color #000
            .refresh
              float right
              display inline-block
              height 40px
              width 40px
              line-height 40px
              border-radius 50%
              color #8492A6
              &:hover
                color green
            .aboutMe
              font-size 0
              .aboutMeContent
                font-size 0
                box-sizing border-box
                padding-right 0
                border-top trendsBorderStyle
                border-bottom 1px solid #eee
                margin-bottom 10px
                .meTitle
                  padding 0 5px
                  height 35px
                  line-height 35px
                  font-size 16px
                  background tabsAboutMeTop  //  f5f6eb
                  border-bottom trendsBorderStyle
                .meContent
                  padding 5px 5px
                  width 100%
                  height 50px
                  font-size 0
                  background informationBgColor
                  .meContentText
                    display inline-block
                    height 50px
                    line-height 50px
                    font-size 16px
                    float left
                  .meContentText
                    text-overflow ellipsis
                    overflow hidden
                    white-space nowrap
                    width 79%
                  .meContentBtn
                    margin-top 6px
                    font-size 16px
                    float right
                    text-align center
                    width 15%
                    margin-right 3%
                    min-width 100px
            .el-tabs__nav
              width 100%
              .el-tabs__item
                text-align center
                width 50%
          .myCourse
            .upload
              width 80%
              height 40px
              line-height 40px
              border 1px solid #ddd
              border-radius 10px
              margin 10px auto
              text-align center
              cursor pointer
              background #daf9ca
              &:hover
                background #cef1bc
          .collect
            font-size 0
            .myCollect
              position relative
              font-size 0
              width 100%
              padding 5px 0
              box-sizing border-box
              border-bottom 8px solid #ddd
              .collectImg
                font-size 16px
                display inline-block
                border-radius 3px
                overflow hidden
                width 150px
                height 110px
                background #f5f6eb
                background-position center center
                background-size cover
                margin-right 15px
                margin-left 5px
                cursor pointer
              .collectContent
                font-size 16px
                display inline-block
                width 50%
                padding-top 10px
                .collectType
                  padding-left 20px
                  line-height 30px
                  height 30px
                  display inline-block
                .collectTitle
                  font-size 16px
                  font-weight bold
                  padding-right 25px
                  cursor pointer
                .collectAuthor
                  font-size 14px
                  color #999
                  cursor pointer
                .collectText
                  font-size 16px
                  display inline-block
                  box-sizing border-box
                  position relative
                  padding-right 20px
                  height 75px
                  line-height 25px
                  overflow hidden
                  margin 10px 0 0 0
                  &:hover
                    text-decoration underline
                    cursor pointer
              .collectBtn
                display line-height
                position absolute
                right 30px
                top 48px
                width 100px
                height 40px
                border 1px solid #888
                border-radius 8px
                background #ddd
                font-size 16px
                text-align center
                box-sizing border-box
                padding-top 8px
                vertical-align middle
                color #666
                cursor pointer
                &:hover
                  background #aaa
                  color #000

          .aboutMeColor
            .el-tabs__nav
              :nth-child(2n)
                color red
    .hint
      width 100%
      background #eee
      border-radius 8px
      margin-left 20px
      border 1px solid #999
      .follow,.leader
        text-align center
        float left
        width 50%
        cursor pointer
        overflow hidden
        box-sizing border-box
        &:hover
          background #ddd
      .follow
        border-right 1px solid #999
        border-radius 8px 0 0 8px
      .leader
        border-radius 0 8px 8px 0
      .name
        height 30px
        vertical-align middle
        line-height 30px
      .hintContent
        height 40px
        line-height 40px
    .el-form-item__label
      text-align center
    .imgList
      width 100%
      min-height 300px
      .bgImg
        float left
        display inline-block
        cursor pointer
        width 33%
        height 300px
        margin-right 2px
      .isBgWrapper
        width 100%
        height 100%
        text-align center
        background rgba(0,0,0,0.5)
      .isBg
        display inline-block
        padding-top 43%
        font-size 24px

  @media screen and (max-width: 1430px)
    .user
      .el-dialog__wrapper
        .el-dialog
          width 60%
      .informationCol
        width 60%
      .hintCol
        display none
  @media screen and (max-width: 1075px)
    .user
      .el-dialog__wrapper
        .el-dialog
          width 76%
      .el-row
        .el-col-14
          width 80%
        .informationCol
          width 80%
          .content
            .mainTabs
              .el-tabs__content
                .collect
                  .myCollect
                    padding-left 10px
                    .collectImg
                      display none
                    .collectContent
                      width 70%
                    .collectBtn
                      right 15px
  @media screen and (max-width: 740px)
    .user
      .el-dialog__wrapper
        .el-dialog
          width 85%
      .el-row
        .el-col-14
          width 86%
          position relative
          left -22px
        .informationCol
          width 95%
        .content
          .mainTabs
          .el-tabs__content
            .childTabs
              .follow
                .followItem
                  .followContent
                    .followTitle
                      .followName
                        min-width 100px
                      .followType
                        margin-left 5px
            .collect
              .myCollect
                padding-bottom 50px
                .collectContent
                  width 95%
                .collectBtn
                  top 140px

  @media screen and (max-width: 680px)
    .user
      .el-dialog__wrapper
        .el-dialog
          width 90%
      .information
        .theimg
          display none
        .message
          left 15px
          width 50%
        /*.changeBg
          display none
        .changeMsg
          display none*/
      .content
        .mainTabs
          .el-tabs__content
            .childTabs
              .follow
                .followItem
                  padding-bottom 50px
                  .followBtn
                    top 77px
  @media screen and (max-width: 512px)
    .user
      .el-dialog__wrapper
        .el-dialog
          width 95%
      .content
        .mainTabs
          .el-tabs__content
            .childTabs
              .follow
                .followItem
                  .followBtn
                    top 112px
                  .followContent
                    .followTitle
                      .followAttr
                        display block
                    .followSkill
                      padding-top 35px
  @media screen and (max-width: 480px)
    .user
      .el-dialog__wrapper
        .el-dialog
          width 99%
      .content
        .mainTabs
          .el-tabs__content
            .collect
              .myCollect
                .collectContent
                  .collectType
                    padding-left 5px
                    i
                      display none
                  .collectTitle
                    padding-right 5px
  @media screen and (max-width: 370px)
    .user
      .content
        .mainTabs
          .el-tabs__content
            .childTabs
              .follow
                .followItem
                  .followBtn
                    top 175px
            .collect
              .myCollect
                .collectContent
                  .collectAuthor
                    display none
</style>
