import {
  ADD_TO_CART,
  ADD_COUNTER
} from "@/store/mutation-types";

export default {
  addCart(context, payload) {
    return new Promise((resolve, reject) => {
      //1. payload 新添加的商品
      let oldProduct = context.state.cartList.find(item => item.iid === payload.iid)

      //2.判断oldProduct是否有值
      if (oldProduct) {
        context.commit(ADD_COUNTER, oldProduct)
        resolve('当前商品数量+1')
      } else {
        payload.count = 1
        context.commit(ADD_TO_CART, payload)
        resolve('添加了新的商品')
      }
    })
  }
}
