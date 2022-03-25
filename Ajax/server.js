var express = require('express')
var app = express()
app.all('*', function (req, res) {
    //设置可以接收请求的域名
    res.header('Access-Control-Allow-Origin', '*');//可以接受哪个域发的请求
    res.header('Access-Control-Allow-Methods', 'GET, POST,PUT');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    res.header('Content-Type', 'application/json;charset=utf-8');
    req.next();
})
app.get('/getUserNameInfo', function (req, res) {
  var userName = req.query.name

  //获取请求的回调函数
  var callbackFn = req.query.callback
  console.log('callbackFn==', callbackFn)
  console.log('userName=', userName)

  var result = {
    id: 10001,
    userName: userName,
    userAge: 21,
  }
  var data = JSON.stringify(result)
  res.writeHead(200, { 'Content-type': 'application/json' })
  //返回值是对对回调函数的调用
  res.write(callbackFn + '(' + data + ')')
  //   res.write(data)
  res.end()
})
app.listen(3000, function () {
  console.log('服务端启动....')
})
