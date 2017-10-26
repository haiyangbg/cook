# 说明
这是 [上线地址](http://47.94.224.249/) ， ----[后端代码在这](https://github.com/SeaBiscuit-Z/cookServer "asp.net webapi") 

采用前后端分离的方式开发的 响应式 在线厨艺教学网站 , pc端访问最优体验

# 技术栈:

### 前端
vue2.0全家桶 + stylus + webpack  + element-ui + animate.css + [vueLazyload](https://github.com/hilongjw/vue-lazyload)  +  [jsonServer](https://github.com/typicode/json-server)

### 后端
三层 + asp.net mvc WebApi + cors + sqlServer

#项目运行截图（pc端）

首页：

![首页](https://raw.githubusercontent.com/SeaBiscuitbyZS/ImageCache/master/cook/home.gif) 

美食推荐：

![美食推荐](https://raw.githubusercontent.com/SeaBiscuitbyZS/ImageCache/master/cook/recommend.gif) 




# 项目运行

```Javascript
// src / main.js  第11 ， 12行 

//axios.defaults.baseURL = 'http://localhost:1528';   //取消此行代码的注释，将后面的路径改为后端后运行的路径
axios.defaults.baseURL = 'http://47.94.224.249:666';  //这是我线上的地址，把此行代码注释
```


# 项目文件布局

```
.
├── build                                       // webpack配置文件
├── config                                      // 项目打包路径
├── src                                         // 源码目录
│   ├── assets                                  // 字体svg,css文件和独立js文件
│   │   ├── css                                 // 字体css文件
│   │   ├── fonts                               // 字体文件
│   │   ├── js                                  // 滚动动画js文件
│   │   └──  logo                               // logo图片
│   ├── components                              // 处理路由
│   |   ├── content                             // 内容页面
│   |   |   ├── chef                            // "大厨课堂"页面文件夹
│   |   |   |   └──  chefPage.vue               // "大厨课堂"页面
│   |   |   ├── Course                          // "美食教程"页面文件夹
│   |   |   |   ├── courseContent.vue           // 具体教程页面
│   |   |   |   ├── courseMain.vue              // 搜索排行组件
│   |   |   |   ├── coursePage.vue              // "美食教程"头部组件
│   |   |   |   ├── courseRecommend.vue         // 教程推荐组件
│   |   |   |   └── courseSelect.vue            // 搜索页面
│   |   |   ├── main                            // 首页文件夹
│   |   |   |   └──mainPage.vue                 // 首页
│   |   |   └── user                            // 个人中心页面
│   |   |       ├── back.vue                    // 页面跳转
│   |   |       ├── headimg.vue                 // 头像组件
│   |   |       ├── information.vue             // 教程简介组件
│   |   |       ├── loading.vue                 // 加载组件
│   |   |       └── userPage.vue                // 用户页面
│   |   ├── header                              // 页面头部文件夹
│   |   |   └── header.vue                      // 页面头部组件
│   |   └──  MyComponent                        // 小功能插件
│   |       ├── backToTop.vue                   // 回到顶部小圆点
│   |       └──  video.vue                      // H5视频组件
│   ├── router                                  // 路由
│   |   └── routers.js                          // 处理路由
│   ├── App.vue                                 // 页面入口文件
│   └── main.js                                 // 程序入口文件，加载各种公共组件
├── static                                      // 静态图片视频资源
├── favicon.ico                                 // 图标
└──  index.html                                 // 入口html文件
.
```
