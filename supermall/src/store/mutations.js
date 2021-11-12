import {
  ADD_TO_CART,
  ADD_COUNTER
} from "@/store/mutation-types";

export default {
  /*
    * mutations唯一的目的就是修改state中的状态
    * mutations中的每个方法完成的事件尽可能单一
    * 如果是复杂的操作则先传到 actions 中完成
    * 这一步的操作的目的是为了使得mutations可以跟踪所有的操作
    *
    * */
  [ADD_COUNTER](state, payload) {
    payload.count++
  },
  [ADD_TO_CART](state, payload) {
    payload.checked = true
    state.cartList.push(payload)
  }
}
