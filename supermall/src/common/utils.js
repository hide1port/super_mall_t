//4.防抖函数
//在这里将要频繁调用的函数（func）用防抖函数（debounce）包起来，
//保证在限定时间（delay）内该函数只执行一次
export function debounce(func, delay) {
  let timer = null
  return function (...args) {
    //此处timer作为局部变量没有销毁的原因是因为产生了闭包
    //因此可以频繁调用来进行判断
    if(timer){
      clearTimeout(timer)
    }
    timer = setTimeout(() => {
      func.apply(this, args)
    }, delay)
  }
}
