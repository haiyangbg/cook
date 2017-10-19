
import Vue from 'vue'
import VueRouter from 'vue-router'
//首页
import main from ".././components/content/main/mainPage.vue"
//教程推荐
import course from ".././components/content/course/coursePage.vue"
import courseMain from '.././components/content/course/courseMain.vue'
import courseSelect from '.././components/content/course/courseSelect.vue'
import courseRecommend from '.././components/content/course/courseRecommend.vue'
import courseContent from '.././components/content/course/courseContent.vue'
//大厨推荐
import chef from ".././components/content/chef/chefPage.vue"
//个人中心
import user from ".././components/content/user/userPage.vue"


Vue.use(VueRouter)
const routes = [
  {path: '/',  component: main },
  {path: '/course' ,  component: (resolve) => require(['.././components/content/course/coursePage.vue'], resolve),
    children : [
      { path: '/course/',  component: (resolve) => require(['.././components/content/course/courseMain.vue'], resolve),
        children : [
          { path: '/course/',  component: (resolve) => require(['.././components/content/course/courseRecommend.vue'], resolve) },
          { path: '/course/Select',  component: (resolve) => require(['.././components/content/course/courseSelect.vue'], resolve) }
        ]
      },
      { path: '/course/Content', component: (resolve) => require(['.././components/content/course/courseContent.vue'], resolve) }
    ]
  },
  {path: '/chef', component: (resolve) => require(['.././components/content/chef/chefPage.vue'], resolve) },//chef
  { path: '/user',
    meta: {
      requireAuth: true
    },
    component: (resolve) => require(['.././components/content/user/userPage.vue'], resolve)
  },
  {
    path: '/back', component: (resolve) => require(['.././components/content/user/back.vue'], resolve)
  }
];

const router = new VueRouter({
  routes: routes,
  //mode: 'history',
  linkActiveClass: 'active'
});


export {router,routes};


