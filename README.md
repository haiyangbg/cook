# 说明
此应用采用前后端分离 , [后端代码在这](https://github.com/SeaBiscuit-Z/cookServer "asp.net webapi") , 这是 [上线地址](http://47.94.224.249/)

响应式 在线厨艺教学网站 , pc端访问最优体验

# 技术栈:

### 前端
vuejs2.0 + vue-router + vue-axios + stylus + webpack  + element-ui + animate.css + [vueLazyload](https://github.com/hilongjw/vue-lazyload)  +  [jsonServer](https://github.com/typicode/json-server)

### 后端
三层 + asp.net mvc WebApi + cors + sqlServer

# 项目运行

```Javascript
//main.js 里

//axios.defaults.baseURL = 'http://localhost:1528';   //取消此行代码的注释，将后面的路径改为后端后运行的路径
axios.defaults.baseURL = 'http://47.94.224.249:666';  //这是我线上的地址，把此行代码注释
```

```
.
├── build                                       // webpack配置文件
├── config                                      // 项目打包路径
├── src                                         // 源码目录
│   ├── assets                                  // 字体svg,css文件和独立js文件
│   │   ├── css                                 // 字体css文件
│   │   ├── fonts                               // 字体文件
│   │   ├── js                                  // 滚动动画js文件
│   │   └──  logo                                // logo图片
│   ├── components                              // 处理路由
│   |   ├── content                             // 内容页面
│   |   |   ├── chef                            // 
│   |   |   ├── Course 
│   |   |   ├── main 
│   |   |   └──  user 
│   |   ├── header                              // 页面头部
│   |   └──  MyComponent                         // 小功能插件
│   |       ├── backToTop.vue                   // 回到顶部小圆点
│   |       └──  video.vue                       // H5视频插件
│   ├── router                                  // 组件
│   ├── App.vue                                 // 页面入口文件
│   └── main.js                                 // 程序入口文件，加载各种公共组件
├── static                                      // 静态图片视频资源
├── favicon.ico                                 // 图标
└──  index.html                                  // 入口html文件
.
```
