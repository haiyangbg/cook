<template>
  <div class="header">
      <el-row style="z-index: 1000;">
        <el-col :span="24" class="header-col">
          <el-menu :default-active="activeIndex" class="header-nav" mode="horizontal" :router=isRouter >
            <el-row style="height: 50px;">
              <el-col :xs="0" :sm="1" :md="2" :lg="2" class="row-item"></el-col>
              <el-col :xs="9" :sm="4" :md="3" :lg="3" class="row-item logo">
                <div @click="toMain" style="width: 100%; height: 100%;"></div>
              </el-col>
              <!--导航栏开始-->
              <el-col class="menu-big row-item" :xs="0" :sm="3" :md="5" :lg="9"></el-col>
              <el-col class="menu-big" :xs="0" :sm="16" :md="14" :lg="10">
                <el-menu-item class="row-item" index="0" :route="routesPath[0]">每日推荐</el-menu-item>
                <el-menu-item class="row-item" index="1" :route="routesPath[1]">美食教程</el-menu-item>
                <el-menu-item class="row-item" index="2" :route="routesPath[2]">大厨课堂</el-menu-item>
                <el-menu-item v-if="!tokenStatus" class="row-item" index="3" style="padding: 0">
                  <div @click.stop.prevent="headImgLoginForm" class="menuWrapper" style="top: -4px; padding-top: 4px;">登录 / 注册</div>
                </el-menu-item>
                <el-menu-item class="row-item clearHover" v-else index="3" style="padding: 0">
                  <div class="menuWrapper" @click.stop.prevent="return false;">
                    <div class="imgWrapper" v-popover:popover0 >
                      <headImg class="imgTransform" :size="'S'" :url="tokenValidate.info.url"></headImg>
                      <el-popover ref="popover0" v-model="popShow" popper-class="popOption" width="105" style="padding: 0;" placement="bottom" trigger="click">
                        <el-button type="success" @click="toHome" style="width: 150px; margin: 0;"><i class="el-icon-information"></i>个人主页</el-button>
                        <el-button type="success" style="width: 150px; margin: 0;"><i class="el-icon-upload2"></i>上传教程</el-button>
                        <el-button type="danger" @click="logout" style="width: 150px; margin: 0;"><i class="el-icon-delete"></i>退出登录</el-button>
                      </el-popover>
                    </div>
                  </div>
                </el-menu-item>
              </el-col>
              <!--小导航-->
              <el-col class="menu-small row-item" :xs="2" :sm="14" :md="15" :lg="16"></el-col>
              <el-col class="menu-small row-item" :xs="6" :sm="14" :md="15" :lg="16">
                <el-menu-item class="row-item no-border" index="5" :route="routesPath[3]">{{ token!=='' ? "主页" : "登录" }}</el-menu-item>
              </el-col>
              <el-col class="menu-small row-item" :xs="6" :sm="0" :md="0" :lg="0">
                <el-dropdown trigger="click">
                  <span class="el-dropdown-link">导航菜单<i class="el-icon-caret-bottom el-icon--right"></i></span>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item><div class="row-item"><router-link :to="routesPath[0]">每日推荐</router-link></div></el-dropdown-item>
                    <el-dropdown-item><div class="row-item"><router-link :to="routesPath[1]">美食教程</router-link></div></el-dropdown-item>
                    <el-dropdown-item><div class="row-item"><router-link :to="routesPath[2]">大厨课堂</router-link></div></el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </el-col>
              <el-col class="menu-small row-item" :xs="2" :sm="0" :md="0" :lg="0"></el-col>
              <!--导航栏结束-->
            </el-row>
          </el-menu>
        </el-col>
      </el-row>
    <el-dialog class="login" :visible.sync="loginForm" size="tiny" :modal-append-to-body="false" :lock-scroll="false" :show-close="false">
      <el-tabs v-model="loginTabActive">
          <el-tab-pane label="登录" name="0">
            <el-form label-width="80px" :model="load" ref="login">
              <el-form-item label="手机号" prop="phone">
              <el-input v-model="load.phone" placeholder="输入手机号"></el-input>
              </el-form-item>
              <el-form-item label="密码" prop="pwd">
                <el-input type="password" v-model="load.pwd" placeholder="输入密码">
                  <el-button slot="append">
                    <el-tooltip class="item" effect="dark" content="忘记密码？" placement="right">
                      <i class="el-icon-warning" style="font-size: 20px;"></i>
                    </el-tooltip>
                  </el-button>
                </el-input>
              </el-form-item>
            </el-form>
          </el-tab-pane>
          <el-tab-pane label="注册" name="1">
            <el-form label-width="80px" :rules="rules" :model="register" ref="register">
              <el-form-item label="手机号" prop="phone">
                <el-input v-model="register.phone" placeholder="输入手机号"></el-input>
              </el-form-item>
              <el-form-item label="密码" prop="pwd">
                <el-input type="password" v-model="register.pwd" placeholder="输入密码"></el-input>
              </el-form-item>
              <el-form-item label="确认密码" prop="ispwd">
                <el-input type="password" v-model="register.ispwd" placeholder="再次输入密码"></el-input>
              </el-form-item>
              <el-form-item label="验证码" prop="code">
                <el-input v-model="register.code" placeholder="输入验证码">
                  <el-button slot="append" @click="imgRandom()">
                    <img :src="imgurl" alt="">
                  </el-button>
                </el-input>
              </el-form-item>
            </el-form>
          </el-tab-pane>
        </el-tabs>
      <div slot="footer" class="dialog-footer">
        <el-button type="success" @click="loginClick" style="width: 100%;">确 定</el-button>
      </div>
      <div class="close" @click="headImgLoginForm"><i class="el-icon-close"></i></div>
    </el-dialog>
  </div>
</template>

<script type="text/ecmascript-6">
  let qs = require('qs')
  import headImg from '.././content/user/headimg.vue'

  import Vue from 'vue'
  import ElMenu from 'element-ui/lib/menu'
  import ElMenuItem from 'element-ui/lib/menu-item'
  import ElDropdown from 'element-ui/lib/dropdown'
  import ElDropdownMenu from 'element-ui/lib/dropdown-menu'
  import ElDropdownItem from 'element-ui/lib/dropdown-item'
  import ElDialog from 'element-ui/lib/dialog'
  import ElForm from 'element-ui/lib/form'
  import ElButton from 'element-ui/lib/button'
  import ElTabs from 'element-ui/lib/tabs'
  import ElTabPane from 'element-ui/lib/tab-pane'
  import ElFormItem from 'element-ui/lib/form-item'
  import ElInput from 'element-ui/lib/input'
  import ElTooltip from 'element-ui/lib/tooltip'
  import ElPopover from 'element-ui/lib/popover'
  import Message from 'element-ui/lib/message'

  Vue.use(ElMenu)
  Vue.use(ElMenuItem)
  Vue.use(ElDropdown)
  Vue.use(ElDropdownMenu)
  Vue.use(ElDropdownItem)
  Vue.use(ElDialog)
  Vue.use(ElForm)
  Vue.use(ElButton)
  Vue.use(ElTabs)
  Vue.use(ElTabPane)
  Vue.use(ElFormItem)
  Vue.use(ElInput)
  Vue.use(ElTooltip)
  Vue.use(ElPopover)
  //Vue.component(Message.name, Message)

  const activeIndex = '0'

  import {routes} from '../.././router/routers'
  export default {
    data() {
      let validatorPhone = (rule, value, callback) => {
        if (!value) {
          callback(new Error("手机号不能为空"));
        }
        value = (value + '').trim();
        if (/^1[0-9]{10}$/.test(value)) {
          this.axios.get("/api/ValidatorPhone/"+value+"").then((res)=>{
            if(!res.data) {
              callback();
            } else {
              callback(new Error("手机号码已被注册!"));
            }
          }).catch(()=>{

          });
        } else {
          callback(new Error("输入的手机号码不正确"));
        }
      };
      let validatorPwd = (rule, value, callback) => {
        if (!value) {
          callback(new Error("密码不能为空"));
        }
        value = (value + '').trim();
        if (value.length > 20 || value.length <= 3) {
          callback(new Error("密码不要超过20位或小于三位"));
        } else if (!(/^(?![a-zA-z]+$)(?!\d+$)(?![\.!@#$%^&*]+$)[a-zA-Z\d\.!@#$%^&*]+$/.test(value))) {
          callback(new Error("密码必须包含数字,字母,符号的其中两种"));
        } else {
          callback();
        }
      };
      let validatorIsPwd = (rule, value, callback) => {
        if (!value) {
          callback(new Error("确定密码不能为空"));
        }
        value = (value + '').trim();
        if (value === this.register.pwd) {
          callback();
        } else {
          callback(new Error("两次输入的密码不一致"));
        }
      };
      let validatorCode = (rule, value, callback) => {
        if (!value) {
          callback(new Error("验证码不能为空"));
          this.imgRandom();
          return;
        }
        value = (value + '').trim();
        this.axios.get('/api/validate/'+value+'').then((res) => {
          //console.log(res);
          if(res.data) {
            callback();
          }else {
            callback("验证码错误");
            this.imgRandom();
          }
        }).catch(() => {
          this.imgRandom();
            callback("验证码错误");
          }
        );
      };
      return {
        activeIndex: activeIndex,
        routesPath: routes,
        isRouter: true,
        //loginForm : this.$store.state.loginForm,
        load: {phone: "", pwd: "", code: ""},
        register: {phone: "", pwd: "", ispwd: "", code: ""},
        rules: {
          phone: [
            {required: true, validator: validatorPhone, trigger: 'change,blur'}
          ],
          pwd: [
            {required: true, validator: validatorPwd, trigger: 'change,blur'}
          ],
          ispwd: [
            {required: true, validator: validatorIsPwd, trigger: 'blur'}
          ],
          code: [
            {required: true, validator: validatorCode, trigger: 'blur'}
          ]
        },
        imgurl: "http://47.94.224.249:666/img.ashx?0",
        popShow : false,
        tokenValidate : { "status": false, "message": "", "info": { "url" : ""} },
        registerValidate : { "status": false, "message": "", "info": { "token" : "" }  },
        loginValidate : { "status": false, "message": "", "info": { "token" : "" }  },
        logoutValidate : {"status": false, "message": "" },
        loginTabActive : "0"

      };

    },
    computed: {
      token() {
        return window.localStorage.getItem('token');
      },
      loginForm() {
        return this.$store.state.loginForm;
      },
      tokenStatus() {
        return this.$store.state.tokenStatus;
      }

    },
    created() {
      this.checkInfo();
    },
    methods: {
      imgRandom() {
        this.imgurl = "http://47.94.224.249:666/img.ashx?" + Math.floor(Math.random() * 99999999);
      },
      toMain() {
        this.$router.push({ path : '/' });
      },
      toHome() {
        //this.$store.state.userid = 0;
        this.toUser(0);
        this.popShow = false;
      },
      headImgLoginForm() {
        this.$store.state.loginForm = !this.$store.state.loginForm;
      },
      //登录和注册
      loginClick() {
        if (this.loginTabActive === "0") {
          //console.log("登录");
          this.axios.post("/api/login", qs.stringify({"phone": this.load.phone, "pwd": this.load.pwd})).then((res) => {
            if (res.data) {
              //console.log(res.data);
              this.loginValidate = res.data;
              if (this.loginValidate.status) {
                this.headImgLoginForm();
                window.localStorage.setItem("token", this.loginValidate.info.token);
                this.checkInfo();
                Message.success({
                  message: '登录成功！！'
                });
              } else {
                Message.error({
                  message: '账号密码错误！！'
                });

              }
            }
          }).catch();
        } else if(this.loginTabActive === "1") {
          //console.log("注册");
          this.$refs["register"].validate((valid) => {
            if (valid) {
              this.axios.post("/api/register",qs.stringify({ "phone" : this.register.phone , "pwd" : this.register.pwd })).then((res)=>{
                if(res.data){
                  //console.log(res.data);
                  this.registerValidate = res.data;
                  //清除信息
                  this.register = { phone: "", pwd: "", ispwd: "", code: ""};
                  if(this.registerValidate.status) {
                    this.headImgLoginForm();
                    window.localStorage.setItem("token",this.registerValidate.info.token);
                    this.checkInfo();
                    Message.success({
                      message: '注册成功！！'
                    });
                  }else {
                    Message.error({
                      message: '注册信息错误！！'
                    });
                  }
                }
              }).catch();
            } else {
              return false;
            }
          });
        }
      },
      //查token是否有登录信息
      checkInfo() {
        if(localStorage.getItem("token")) {
          this.axios.get('/api/ValidateToken').then((res)=>{
            this.tokenValidate = res.data;
            this.$store.state.tokenStatus = this.tokenValidate.status;
          }).catch((res)=>{
            //console.log("无权限");
          });
        }
      },
      //登出
      logout() {
        this.popShow = false;
        this.axios.get("/api/logout").then((res)=>{
          this.logoutValidate = res.data;
          if(this.logoutValidate.status) {
            window.localStorage.setItem("token","");
            this.$store.state.tokenStatus = false;
            if(this.$route.path === "/user") {
              this.$router.push({ path : '/' });
            }
            Message.success({
              message: '退出成功！！'
            });
          }
        }).catch(
          Message.error({
            message: '网络异常'
          })
        );

      }
    },
    components: {
      headImg
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  navItemColor = rgba(255,255,255,0.6)
  navItemHoverBG = rgba(255,255,255,0.6)
  logoImg = url('../.././assets/logo/logo-w.png')
  .el-popover
    padding 0
    min-width 50px
  .popOption
    padding 0
    min-width 50px
    margin 0
    border-radius 3px
    font-size 0
    background #fff
    .el-button:nth-last-child(2)
      border-top #eee 1px solid
      border-radius 0 0 3px 3px
    .el-button:first-child
      border-top none
      border-radius 3px 3px 0 0
    .el-button
      border-radius 0
      border-left none
      border-right none
      margin 0
      i
        padding-right 5px
  .row-item
    height 50px
    line-height 50px
    text-align center
    vertical-align top
    color navItemColor
  .header
    .login
      .el-dialog__header
        display none
      .el-dialog__body
        padding 10px
        .el-form-item__label
          text-align center
      .close
        border-radius 50%
        position absolute
        top 10px
        right 12px
        cursor pointer
        i
          display inline-block
          padding 10px
          transition all 0.4s
          &:hover
            transform: rotate(90deg)
    .header-col
      height 50px
      box-shadow: -1px 1px 5px rgba(0,0,0,0.3)
      .header-nav
        width 100%
        height 100%
        margin 0
        padding 0
        background rgba(0,0,0,0.2)
        .logo
          background-image logoImg
          background-repeat no-repeat
          background-position center center
          cursor pointer
        .menu-small
          display none
        .menu-big
          .imgWrapper
            height 60px
            position relative
            top -14px
            .imgTransform
              transition all 0.5s
              transform: scale(0.6)
              &:hover
                transform: scale(0.8) translate(0,6px)
          .menuWrapper
            width 100%
            height 50px
            position relative
            padding 0 20px
            box-sizing border-box
        .el-menu-item
          height 50px
          line-height 50px
          border 0
          font-size 16px
          border-top 4px solid rgba(0,0,0,0)
          &:hover
            content ''
            border-bottom 0
            border-top 4px solid #726dd1
            background navItemHoverBG
        .clearHover
          &:hover
            content none
            border-top 4px solid rgba(0,0,0,0)
            background rgba(0,0,0,0)
        .no-border
          border 0

  @media screen and (max-width: 1170px)
    .header
      .login
        .el-dialog
          width 50%

  @media screen and (max-width: 800px)
    .header
      .login
        .el-dialog
          width 70%

  @media screen and (max-width: 767px)
    .header
      .header-col
        .header-nav
          .menu-small
            display block
          .menu-big
            display none

  @media screen and (max-width: 600px)
    .header
      .login
        .el-dialog
          width 85%

  @media screen and (max-width: 500px)
    .header
      .login
        .el-dialog
          width 95%

</style>
