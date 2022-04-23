function throttle(func, wait = 0, trailing = true) {
  if (typeof func !== 'function') {
    throw new TypeError('Expect a function')
  }
  let timer
  let start = +new Date()
  return function (...rest) {
    let now = +new Date()
    if (timer) {
      clearTimeout(timer)
    }
    if (now - start >= wait || trailing) {
      func.apply(this, rest)
      start = now
      trailing = false
    } else {
      timer = setTimeout(() => {
        func(...rest)
      }, wait)
    }
  }
}
/*不管事件触发有多频繁，节流都会保证在规定时间内一定会执行一次真正
的事件处理函数，而防抖只是在最后一次事件触发后才执行一次函数。 */