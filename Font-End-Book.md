## 1.JavaScript/ES6

### 事件委托

弄明白事件委托必须理解事件事件出发的流程

- 捕获阶段：顶级对象document发出一个事件流，顺着dom的树节点向触发它的目标节点流去，直到达到目标元素，这个层层递进，向下找目标的过程为事件的捕获阶段，此过程与事件相应的函数是不会触发的。
- 目标阶段：到达目标函数，便会执行绑定在此元素上的，与事件相应的函数，即事件目标处理函数阶段。
- 冒泡阶段：事件在目标节点上触发后，不会终止，一层层向上冒，回溯到根节点

为什么要在冒泡阶段执行事件？
兼容性更好，在IE8中没有捕获阶段

如何修改执行阶段?
*element*.addEventListener(*event*, *function*, *useCapture*)=====useCapture可选。布尔值，指定事件是否在捕获或冒泡阶段执行。

- true - 事件句柄在捕获阶段执行
- false- false- 默认。事件句柄在冒泡阶段执行

使用e.stopPropgation()或e.cancelBubble = true(IE)可以阻断事件向当前元素的父元素冒泡。

为什么要用事件委托？如果一个ul中包裹了100哥li，每个li有相同的click点击事件，我们一定会想用for循环然后给他们添加事件，在js中添加到页面上的事件处理熟练直接关系到页面的整体运行性能，因为需要不断地与dom节点进行交互，访问dom的次数越多，引起浏览器重绘与重排的次数也就越多，会延长整个页面的交互就绪时间（这也就是为什么性能优化的主要思想之一就是减少dom操作），每一个函数都是一个对象，是对象就会占用内存，对象越多内存的占用率就越大，性能自然就差了。
时间委托的原理就是利用时间冒泡的原理来实现的，有这样一个机制，如果我们给外层的ul加上点击事件，那么里面的li被点击的时候，就会冒泡到外层的ul上，然后外层的ul上的时间被触发，这就是事件委托，委托他们的父级代为执行事件

### 事件循环

一个浏览器通常有以下几个常驻的线程：

- 渲染引擎线程：该线程负责页面的渲染
- JS引擎线程：负责JS的解析和执行
- 定时触发器线程：处理定时事件，比如setTimeout, setInterval
- 事件触发线程：处理DOM事件
- 异步http请求线程：处理http请求

渲染线程和JS引擎线程是不能同时进行的。也就是说在执行代码时，渲染会挂起；渲染DOM时，代码也不会执行。 虽然JS是单线程，但是浏览器是多线程的，在遇到像setTimeout、DOM事件、ajax等这种任务时，会转交给浏览器的其他工作线程(上面提到的几个线程)执行，执行完之后将回调函数放入到任务队列。

```js
// eventLoop是一个用作队列的数组
// （先进，先出）
var eventLoop = [ ];
var event;
// “永远”执行
while (true) {
    // 一次tick
    if (eventLoop.length > 0) {
        // 拿到队列中的下一个事件
        event = eventLoop.shift();
        // 现在，执行下一个事件
        event();
    }
}
```

JS主线程，就像是一个while循环，会一直执行下去。在这期间，每次都会查看任务队列有没有需要执行的任务（回调函数）。在执行完一个任务之后， 会继续下一个循环，直到任务队列所有任务都执行完为止。

#### microtask(微任务)、macrotask(宏任务)

任务队列又分微任务队列和宏任务队列

#### 微任务

- Promise
- MutationObserver（Mutation Observer API 用来监视 DOM 变动）
- Object.observe()（已废弃）

#### 宏任务

- setTimeout
- setInterval
- setImmediate
- I\O
- UI rendering(DOM event)

#### 执行过程

1. 在JS执行完同步任务之后，会开始执行微任务队列

2. 在将所有的微任务执行完之后，会开始执行宏任务队列

3. 在执行完一个宏任务之后，跳出来，重新开始下一个循环(从1开始执行)

4. 也就是说执行微任务队列 会将队列中的所有微任务执行完 而执行宏任务队列 每次只执行一个宏任务 然后重新开始下一个循环 我们可以看看以下代码

   ```js
   setTimeout(() => {
       console.log(3)
       new Promise((resolve, reject) => {
           console.log(5)
           resolve()
       }).then(console.log(6))
   }, 0)
   
   setTimeout(() => {
       console.log(4)
   }, 0)
   
   new Promise((resolve, reject) => {
       console.log(1)
       resolve()
   }).then(console.log(2))
   ```

   输出是1 2 3 5 6 4

   我们来分析一下代码的执行过程

   1. 前面的两个setTimeout都是宏任务，所以现在宏任务队列有2个任务
   2. Promise里面的代码是同步任务，所以现在会马上执行 输出1
   3. Promise的then是微任务，所以现在微任务队列有1个任务
   4. 在执行完同步任务之后，开始执行微任务，也就是console.log(2), 输出2
   5. 在执行完微任务之后，会执行宏任务，第一个宏任务也就是第一个setTimeout
   6. 第一个setTimeout会先输出3，然后输出5，因为这两个都是同步任务，然后遇到then，加入微任务队列，宏任务执行完重新开始下一个循环。
   7. 因为没有同步代码，所以接着执行微任务，此时微任务队列有1个任务(第6步加入), 宏任务队列还有1个任务(第6步执行完了第一个宏任务)
   8. 执行微任务，输出6
   9. 再执行宏任务，输出4

   

## 2.CSS/less/scss

## 3.HTML

## 4.node.js

## 5.promise

## 6.Ajax/axios/fetch

## 7.Webpack

## 8.MongoDB

## 9.TypeScript

## 10.React/React-Router/Redux

## 11.安全

### xss与csrf攻击原理和范围

## 12.协议&网络

### 同源策略

### 跨域请求



### htps如何保证数据安全

## 13.浏览器原理

### 13.1浏览器渲染原理

### 13.2重绘和回流

### 13.3如何减少回流？

1. 尽量少用style，使用class
2. 对于会影响到其他盒子的元素，需要修改带下，可以使用定位
3. 使用代码片段 document.createFragment()
4. display:none  display:block
5. 尽量不要使用 scrollTop scrollLeft offsetWidth offsetHeight强制浏览器回流

## 1x.其他

### 1.前端异常监控

### 2.Ascii、GBK、UTF、Unicode

### 3.正则表达式

### 4.前端性能优化

### 5.RPC

### 6.单点登入

### 7.加水印

前端给页面加水印？

### 8.数字签名
