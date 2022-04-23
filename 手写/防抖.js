function debounce(func, time = 0) {
  if (typeof func !== 'function') {
    throw new TypeError('Expect a function')
  }
  let timer
  return function () {
    if (timer) {
      clearTimeout
    }
    timer = setTimeout(() => {
      func()
    }, time)
  }
}
