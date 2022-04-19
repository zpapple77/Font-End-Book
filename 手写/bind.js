// 完整版bind
Function.prototype.bind = function (context) {
  if (typeof this !== 'function') {
    throw new Error(
      'Function.prototype.bind - what is trying to be bound is not callable'
    )
  }

  var self = this
  var bindArgs = Array.prototype.slice.call(arguments, 1)
  var fNOP = function () {}

  var fbound = function () {
    var args = bindArgs.concat(Array.prototype.slice.call(arguments))
    self.apply(this instanceof self ? this : context, args)
  }

  fNOP.prototype = this.prototype
  fbound.prototype = new fNOP()

  return fbound
}
