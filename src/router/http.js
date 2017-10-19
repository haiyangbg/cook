

import axios from 'axios'
axios.defaults.timeout = 5000;
// http请求拦截器
//let loadinginstace;
axios.interceptors.request.use(config => {
  if (localStorage.getItem('token')) {  // 判断是否存在token，如果存在的话，则每个http header都加上token
    config.headers.Authorization = localStorage.getItem('token');
  }
  // element ui Loading方法
  //loadinginstace = Loading.service({ fullscreen: true });
  return config;
}, error => {
  //loadinginstace.close();
  /*Message.error({
    message: '加载超时'
  });*/
  return Promise.reject(error);
});

// http响应拦截器
axios.interceptors.response.use(data => {// 响应成功关闭loading
  //loadinginstace.close();
  return data;
}, error => {
  switch (error.response.status) {
    case 401:
      // 401 清除token信息
      localStorage.setItem("token","");
    //vuex.state.loginForm = true;

  }
  //loadinginstace.close();
  /*Message.error({
    message: '加载失败'
  });*/
  return Promise.reject(error)
});

export default axios;
