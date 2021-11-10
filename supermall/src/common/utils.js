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

//将时间戳格式化为对应的年月日时分秒形式
export function formatDate(date, fmt) {
  //1.获取年份
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
  }

  //2.获取
  let o = {
    'M+': date.getMonth() + 1,
    'd+': date.getDate(),
    'h+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getSeconds()
  };
  for (let k in o) {
    if (new RegExp(`(${k})`).test(fmt)) {
      let str = o[k] + '';
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? str : padLeftZero(str));
    }
  }
  return fmt;
}

function padLeftZero (str) {
  return ('00' + str).substr(str.length);
};


