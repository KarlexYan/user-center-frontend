import {extend} from 'umi-request';
import message from "antd/es/message";
import {history} from "@@/core/history";
import {stringify} from "querystring";

/**
 * 配置request请求时的默认参数
 */
const request = extend({
  credentials: 'include', // 默认请求是否带上cookie
});

/**
 *  请求拦截器
 */
request.interceptors.request.use((url, options): any => {
  console.log(`do request url = ${url}`)

  return {
    url,
    options: {
      ...options,
      headers: {},
    },
  };
});

/**
 *  响应拦截器
 *  因为后端封装一个响应对象，将所有数据都封装到了一个对象中，每次发送请求都需要进行解包处理
 *  所以可以在拦截器统一解包 返回 res.data
 */
request.interceptors.response.use(async (response,options): Promise<any> => {
  const res = await response.clone().json(); // 将响应克隆，并转换成json格式
  if(res.code === 0){
    return res.data  // 解包返回
  }

  // 未登录
  if(res.code === 40100){
    message.error('请先登录');
    // 跳转回登录页
    history.replace({
      pathname: '/user/login',
      search: stringify({
        redirect: location.pathname,
      }),
    });
  }else {
    message.error(res.description)
  }
  // 错误也封装在全局响应对象中，可以返回
  return res.data
})


export default request;
