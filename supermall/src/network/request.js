import axios from "axios"

export function request(config) {
  // 1.创建axios的实例
  const instance = axios.create({
    baseURL: 'http://152.136.185.210:7878/api/hy66',
    timeout: 5000
  })

  // 2.axios拦截器
  //请求拦截器
  instance.interceptors.request.use(config => {
    return config
  }, err => {
  })

  //响应拦截器
  instance.interceptors.response.use(res => {
    return res.data
  }, error => {
    console.log(error)
  })


  // 3.发送真正的网络请求
  //此处返回的是Promise对象（axios.create()创建的是Promise对象）
  return instance(config)
}

