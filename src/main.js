
import Vue from 'vue'
import app from './app.vue'
import axios from 'axios'
//import axios from './router/http'
import VueAxios from 'vue-axios'

axios.defaults.withCredentials = true;

//axios.defaults.baseURL = 'http://localhost:1528';
axios.defaults.baseURL = 'http://47.94.224.249:666';
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';


axios.defaults.timeout = 5000;
axios.interceptors.request.use(config => {
  if (localStorage.getItem('token')) {
    config.headers.Authorization = localStorage.getItem('token');
  }
  return config;
}, error => {
  return Promise.reject(error);
});
axios.interceptors.response.use(data => {
  return data;
}, error => {
  switch (error.response.status) {
    case 401:
      // 401 清除token信息
      localStorage.setItem("token","");
      store.state.loginForm = true;
  }
  return Promise.reject(error)
});

Vue.use(VueAxios, axios)

// 全局的引用
// import ElementUI from 'element-ui'
import ElCol from 'element-ui/lib/col'
import ElRow from 'element-ui/lib/row'
import { Message } from 'element-ui';
Vue.component(Message.name, Message)
Vue.prototype.$message = Message
Vue.use(ElCol)
Vue.use(ElRow)
// Vue.use(ElementUI)
import 'element-ui/lib/theme-default/index.css'
import './assets/css/main.styl'
import 'animate.css/animate.min.css'

//引入moment.js
import moment from 'moment'
Object.defineProperty(Vue.prototype, '$moment', { value: moment });
//console.log(this.$moment('201708011630','YYYYMMDDHmm').fromNow()); 返回差值

//添加全局函数
Vue.prototype.toSelect = function (id){
  this.$store.state.selectKey = id;
  if(this.$router.path !== '/course/Select') {
    this.$router.push({ path : '/course/Select' });
  }
};
Vue.prototype.toContent= function (id) {
  this.$router.push({ path : '/course/Content' , query : { id : id } });
};
Vue.prototype.toUser = function (id){
  this.$store.state.userid = id;
  this.$router.push({ path : '/back'});
};


import Vuex from 'vuex'
Vue.use(Vuex);
const store = new Vuex.Store({
  state:{
    loginForm : false,
    tokenStatus : false,
    selectKey : "",
    tabchecked : "0",
    scrollTop : 0,
    userTrendsTop : 0,
    userIndex : '0',
    usertrendselect : '0',
    userfollow : '0',
    usercourse : '0',

    userIndexid : '2',
    userfollowid : '0',
    usercourseid : '0',

    userid : 0,
    mydiscuss : ""
  }
});

import VueLazyload from 'vue-lazyload'

Vue.use(VueLazyload, {
  preLoad: 1.3,
  error: '/static/error.png',
  loading: '/static/loading.gif',
  attempt: 2,
  listenEvents: [ 'scroll' ]
});


Vue.prototype.toLogin = function () {
  this.$router.push({ path : '/' });
  this.$store.state.loginForm = true;
};


// 解决300毫秒延迟
import FastClick from 'fastclick';
FastClick.attach(document.body);

Vue.config.productionTip = false;
import {router} from './router/routers'


// Vue.use(ElementUI)
new Vue({
  el: '#app',
  store,
  router,
  render: x => x(app)
});
