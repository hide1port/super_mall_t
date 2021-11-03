//所有对于首页(Home)相关的网络请求

import {request} from "@/network/request";

export function getHomeMultidata() {
  return request({
    url: 'home/multidata'
  })
}
