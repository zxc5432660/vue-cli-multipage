import axios from 'axios'
import router from '../../router/index.js'
import { Dialog, Toast } from 'vant'
import qs from 'qs'
/**
 * 请求中的配置
 * @param {object} config 请求配置
 */
function configAd(config){
   try {
      if (config.url == "/tradeOrder/getByOid") {
        config.headers["oid"] = `${config.params.oid}`
      }
      if (config.url == "/tradeOrder/getHistoryMessageByOid") {
        config.headers["oid"] = `${config.params.oid}`
        config.headers["fromId"] = `${config.params.fromId}`
      }
      if (config.url == "/customerOrderDeal/reChoicePayMethod") {
        config.headers["oid"] = `${config.data.oid}`
        config.headers["payMethod"] = `${config.data.payMethod}`
      }
      if (config.url == "/tradeOrder/getOrdarStateByOid") {
        config.headers["oid"] = `${config.params.oid}`
      }
      if (config.url == "/customerOrderDeal/matchingTrader") {
        config.headers["oid"] = `${config.data.oid}`
      }
      if (config.url == "/customerOrderDeal/cancelOrder") {
        config.headers["oid"] = `${config.data.oid}`
      }
    } catch(err) {
      console.log(err)
    }
}
var instance = axios.create({ 
  timeout: 7000,
  headers: {'Content-Type': 'application/x-www-form-urlencoded'}
});
instance.defaults.retry = 1
instance.defaults.retryDelay = 1000
instance.defaults.withCredentials = true
if (process.env.NODE_ENV == 'development') {   //开发环境
  instance.defaults.baseURL = 'http://192.168.1.40:19002'
} else if (process.env.NODE_ENV == 'testing') {   //测试环境
  instance.defaults.baseURL = 'http://192.168.1.40:19002'
} else if (process.env.NODE_ENV == 'production') {   //正式环境
  instance.defaults.baseURL = 'http://api.foscoin.com'
}else if (process.env.NODE_ENV == 'presentation') {   //预发环境
  instance.defaults.baseURL = 'http://pre.api.foscoin.com'
}else if (process.env.NODE_ENV == 'develop') {   //预发环境
  instance.defaults.baseURL = 'http://192.168.1.80:19002'
} 

instance.defaults.transformRequest = [function (data) {
  let ret = ''
  for (let it in data) {
    ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
  }
  ret = qs.stringify(data) // 这里必须使用qs库进行转换
  return ret
}]
 
// http request 拦截器
instance.interceptors.request.use(
  config => {
    configAd(config)
    return config
  },
  error => {
    return Promise.reject(error)
  }
)
// http response 拦截器
instance.interceptors.response.use(
  response => {
    if (!response.data.successed) {
      Toast(response.data.errorDesc)
    }
    return response.data
  },
  err => {
    if (err && err.response) {
      switch (err.response.status) {
        case 500:
          Dialog('服务端错误')
          break
      }
    }
    if (err.code === 'ECONNABORTED' && err.message.indexOf('timeout') !== -1) {
      Toast("网络超时,请重试")
      return Promise.reject(err)
    }
    
  }
)
/**
 * 封装get方法
 * @param url
 * @param data
 * @returns {Promise}
 */

export function fetch (url, params = {}) {
  return new Promise((resolve, reject) => {
    instance.get(url, {
      params: params
    })
      .then(response => {
        resolve(response)
      })
      .catch(err => {
        reject(err)
      })
  })
}
/**
 * delete
 * @param url
 * @param data
 * @returns {Promise}
 */
export function dele (url, params = {}) {
  return new Promise((resolve, reject) => {
    instance.delete(url, {
      params: params
    })
      .then(response => {
        resolve(response.data)
      })
      .catch(err => {
        reject(err)
      })
  })
}

/**
 * 封装post请求
 * @param url
 * @param data
 * @returns {Promise}
 */

export function post (url, data = {}) {
  return new Promise((resolve, reject) => {
    instance.post(url, data)
      .then(response => {
        let data = response
        resolve(data)
      },err => {
        reject(err)
      })
  })
}

/**
* 封装patch请求
* @param url
* @param data
* @returns {Promise}
*/

export function patch (url, data = {}) {
  return new Promise((resolve, reject) => {
    instance.patch(url, data)
      .then(response => {
        resolve(response.data)
      }, err => {
        reject(err)
      })
  })
}

/**
* 封装put请求
* @param url
* @param data
* @returns {Promise}
*/

export function put (url, data = {}) {
  return new Promise((resolve, reject) => {
    instance.put(url, data)
      .then(response => {
        resolve(response)
      }, err => {
        reject(err)
      })
  })
}
 