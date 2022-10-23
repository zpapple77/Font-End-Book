









































# codewhy















































 











# 面试

## 1.JavaScript/ES6

### 1.1事件委托

弄明白事件委托必须理解事件事件出发的流程

- 捕获阶段：顶级对象document发出一个事件流，顺着dom的树节点向触发它的目标节点流去，直到达到目标元素，这个层层递进，向下找目标的过程为事件的捕获阶段，**此过程与事件相应的函数是不会触发的**。
- 目标阶段：到达目标函数，便会执行绑定在此元素上的，与事件相应的函数，即事件目标处理函数阶段。
- 冒泡阶段：事件在目标节点上触发后，不会终止，一层层向上冒，回溯到根节点

为什么要在冒泡阶段执行事件？
**兼容性更好，在IE8中没有捕获阶段**

如何修改执行阶段?
*element*.addEventListener(*event*, *function*, *useCapture*)=====useCapture可选。布尔值，指定事件是否在捕获或冒泡阶段执行。

- true - 事件句柄在捕获阶段执行
- false- false- 默认。事件句柄在冒泡阶段执行

使用e.stopPropgation()或e.cancelBubble = true(IE)可以阻断事件向当前元素的父元素冒泡。

为什么要用事件委托？如果一个ul中包裹了100个li，每个li有相同的click点击事件，我们一定会想用for循环然后给他们添加事件，在js中添加到页面上的事件处理熟练直接关系到页面的整体运行性能，因为需要不断地与dom节点进行交互，访问dom的次数越多，引起浏览器重绘与重排的次数也就越多，会延长整个页面的交互就绪时间（这也就是为什么性能优化的主要思想之一就是减少dom操作），每一个函数都是一个对象，是对象就会占用内存，对象越多内存的占用率就越大，性能自然就差了。
时间委托的原理就是利用时间冒泡的原理来实现的，有这样一个机制，如果我们给外层的ul加上点击事件，那么里面的li被点击的时候，就会冒泡到外层的ul上，然后外层的ul上的时间被触发，这就是事件委托，委托他们的父级代为执行事件

### 1.2事件循环

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

#### 1.2.1微任务

- Promise
- MutationObserver（Mutation Observer API 用来监视 DOM 变动）
- Object.observe()（已废弃）

#### 1.2.2宏任务

- setTimeout  3
- setInterval   3
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


### 1.3 preventDefault

preventDefault方法的起什么作用呢？我们知道比如<a href="http://www.baidu.com">百度< /a> 起的作用就是点击百度链接到http://www.baidu.com,这是属于<a>标签的默认行为，而preventDefault方法就是可以阻止它的默认行为的发生而发生其他的事情。

### 1.4stopPropagation&cancelBubble

阻止捕获和冒泡阶段中当前事件的进一步传播。

但是，它不能防止任何默认行为的发生； 例如，对链接的点击仍会被处理。

如果要停止这些行为，请参见 [preventDefault](https://developer.mozilla.org/zh-CN/docs/Web/API/Event/preventDefault) 方法，它可以阻止事件触发后默认动作的发生。

事实上stoppropagation和cancelBubble的作用是一样的，都是用来阻止浏览器默认的[事件冒泡](https://so.csdn.net/so/search?q=事件冒泡&spm=1001.2101.3001.7020)行为。

不同：stoppropagation属于W3C标准，适用于Firefox等浏览器，但是不支持IE浏览器。

相反cancelBubble不符合W3C标准，而且只支持IE浏览器。所以很多时候，我们都要结合起来用。不过，cancelBubble在新版本chrome,opera浏览器中已经支持。

![img](https://gitee.com/cod3kin9/image-host/raw/master/image/20220306190046.png)

**即该方法不仅仅可以阻止冒泡，还可以阻止捕获和处于目标阶段。**

### 1.5自定义事件

```js
const div = document.createElement('div') // 不创建元素，直接用 window 对象也可以
const event = new Event('build')

div.addEventListener('build', function(e) {
    console.log(111)
})

div.dispatchEvent(event)//触发事件
```

### 1.6target和currentTarget区别

- event.target
  返回触发事件的元素
- event.currentTarget
  返回绑定事件的元素

### 1.7prototype和__ proto__的关系是什么

**先说结论：**

1. `prototype` 用于访问函数的原型对象。

2. `__proto__` 用于访问对象实例的原型对象（或者使用 `Object.getPrototypeOf()`）。

   ```js
   function Test() {}
   const test = new Test()
   test.__proto__ == Test.prototype // true
   ```

   函数拥有 `prototype` 属性，对象实例拥有 `__proto__` 属性，它们都是用来访问原型对象的。

   函数有点特别，它不仅是个函数，还是个对象。所以它也有 `__proto__` 属性。

### 1.8继承

ES5中的继承，看图：

![img](https://images2015.cnblogs.com/blog/339959/201606/339959-20160621160510881-1716509128.png)

```js
case 1
function Super() {}
function Sub() {}
Sub.prototype = new Super();
Sub.prototype.constructor = Sub;

var sub = new Sub();

Sub.prototype.constructor === Sub; // ② true
sub.constructor === Sub; // ④ true
sub.__proto__ === Sub.prototype; // ⑤ true
Sub.prototype.__proto__ == Super.prototype; // ⑦ true

case 2
function SuperType(name) {
    this.name = name
}

SuperType.prototype.sayName = function() {
    console.log(this.name)
}

function SubType(name, age) {
    SuperType.call(this, name)
    this.age = age
}

function extendPrototype(Sub, Super) {
    Sub.prototype = Object.create(Super.prototype)
    Sub.prototype.constructor = Sub
}

extendPrototype(SubType, SuperType)

SubType.prototype.sayAge = function() {
    console.log(this.age)
}

const sub = new SubType('tom', 18)
sub.sayAge() // 18
sub.sayName() // tom

```

ES6中的继承，看图：

![img](https://images2015.cnblogs.com/blog/339959/201606/339959-20160621160651772-1577921554.png)

```js

class Sub extends Super {}

var sub = new Sub();

Sub.prototype.constructor === Sub; // ② true
sub.constructor === Sub; // ④ true
sub.__proto__ === Sub.prototype; // ⑤ true
Sub.__proto__ === Super; // ⑥ true
Sub.prototype.__proto__ === Super.prototype; // ⑦ true



class SuperType {
    constructor(name) {
	this.name = name
    }

    sayName() {
	console.log(this.name)
    }
}

class SubType extends SuperType {
    constructor(name, age) {
	super(name)
	this.age = age
    }

    sayAge(age) {
	console.log(this.age)
    }
}

const sub = new SubType('tom', 18)
sub.sayAge() // 18
sub.sayName() // tom
```

### 1.9闭包

闭包是指有权访问另一个函数作用域中的变量的函数

```js
function sayHi(name) {
    return () => {
       console.log(`Hi! ${name}`)
    }
}
const test = sayHi('xiaoming')
test() // Hi! xiaoming
```

虽然sayHi函数已经执行完毕，但是其活动对象也不会被销毁，因为test函数仍然引用着sayHi函数中的变量name，这就是闭包。

但也因为闭包引用着另一个函数的变量，导致另一个函数即使不使用了也无法销毁，所以闭包使用过多，会占用较多的内存，这也是一个副作用。

#### 利用闭包实现私有属性

```js
const test = (function () {
    let value = 0
    return {
        getVal() { return value },
        setVal(val) { value = val }
    } 
})()
```

上面的代码，就实现了一个私有属性 `value`，它只能用过 `getVal()` 来获取值，通过 `setVal(val)` 来设置值。

### 1.10内存回收

有两种内存回收算法。第一种是引用计数垃圾收集，第二种是标记-清除算法（从2012年起，所有现代浏览器都使用了标记-清除垃圾回收算法）。

#### 引用计数垃圾收集

如果一个对象没有被其他对象引用，那它将被垃圾回收机制回收。

```js
let o = { a: 1 }
```

一个对象被创建，并被 o 引用。

```js
o = null
```

刚才被 o 引用的对象现在是零引用，将会被回收。

循环引用

引用计数垃圾收集有一个缺点，就是循环引用会造成对象无法被回收。

```js
function f(){
  var o = {};
  var o2 = {};
  o.a = o2; // o 引用 o2
  o2.a = o; // o2 引用 o

  return "azerty";
}

f();
```

在 f() 执行后，函数的局部变量已经没用了，一般来说，这些局部变量都会被回收。但上述例子中，o 和 o2 形成了循环引用，导致无法被回收。

#### 标记-清除算法

这个算法假定设置一个叫做根（root）的对象（在Javascript里，根是全局对象）。垃圾回收器将定期从根开始，找所有从根开始引用的对象，然后找这些对象引用的对象……从根开始，垃圾回收器将找到所有可以获得的对象和收集所有不能获得的对象。

对于刚才的例子来说，在 f() 执行后，由于 o 和 o2 从全局对象出发无法获取到，所以它们将会被回收。

#### 高效使用内存

在 JS 中能形成作用域的有函数、全局作用域、with，在 es6 还有块作用域。局部变量随着函数作用域销毁而被释放，全局作用域需要进程退出才能释放或者使用 delete 和赋空值 `null` `undefined`。

在 V8 中用 delete 删除对象可能会干扰 V8 的优化，所以最好通过赋值方式解除引用。

### 数组遍历有哪些方式？

#### for

#### forEach()函数

#### map（）

#### some( )函数与every( )函数

`some( )`函数与`every( )`函数的相似之处都是在对数组进行遍历的过程中，判断数组中是否有满足条件的元素，如果有满足条件的就返回`true`,否则返回`false`.

`some()`与`every()`的区别在于:`some( )`函数只要数组中某个元素满足条件就返回`true`,不会在对后面的元素进行判断。而`every( )`函数是数组中每个元素都要满足条件时才会返回`true`.

#### find( )函数

`find( )` 函数用于数组的遍历，当找到第一个满足条件的元素值时，则直接返回该元素值，如果都找不到满足条件的，则返回`undefined`.`find( )`方法的参数与`forEach`是一样的。

### 函数定义有哪几种实现方式

第一类是函数声明。

```js
function sum(num1, num2){
     return num1 + num2
}
```



第二类是函数表达式

```js
var sum =  function (num1,num2){    return num1 + num2}
```



第三类是通过`Function`构造函数来完成函数的定义。

```js
var sum = new Function('num1','num2', 'return a+b ')
```



## 2.CSS/less/scss

### 2.1文本溢出省略号

```css
单行
/*强制一行内显示文本*/
white-space:nowrap;(默认是normal自动换行)
/*超出部分折叠*/
overflow：hidden
/*文字用省略号代替超出的部分*/
text-overflow：ellipsis
多行
/**/
```

2.2清除浮动有哪些种方式

为什么需要清除浮动？

1. 父级没高度。
2. 子盒子浮动了。
3. 影响下面布局了，我们就应该清除浮动了

![image-20220310154912239](C:\Users\ASUS\AppData\Roaming\Typora\typora-user-images\image-20220310154912239.png)

1.额外标签法 

```css
<div style="clear:both"></div>
```



2、父级添加 overflow 属性 

```css
overflow:hidden | auto | scroll
```



3、父级添加after伪元素

```css
.clearfix:after {  
   content: ""; 
   display: block; 
   height: 0; 
   clear: both; 
   visibility: hidden;  
 } 
 .clearfix {  /* IE6、7 专有 */ 
   *zoom: 1;
 }   
```

4.父级添加双伪元素

```css
 .clearfix:before,.clearfix:after {
   content:"";
   display:table; 
 }
 .clearfix:after {
   clear:both;
 }
 .clearfix {
    *zoom:1;
 }   
```

## 3.HTML

## 4.node.js

## 5.promise

## 6.Ajax/axios/fetch

## 7.Webpack

## 8.MongoDB

## 9.TypeScript

## 10.React/React-Router/Redux

### 1 redux-thunk原理

![img](https://img2018.cnblogs.com/blog/331769/201903/331769-20190320064356094-1041948774.png)

view在redux中会派发一个action，action通过store的dispatch方法派发给store,store接收到action，连同之前到state，一起传给reducer，reducer返回一个新到数据给store,store去改变自己到state。这是redux的一个标准流程，那么我们说redux的中间件指的是谁和谁的之间，大家一定要记住，**redux的中间件指的是action和store之间。之前我们说action只能是一个对象，所以action是一个对象直接派发给了store。**但是现在，当我们使用了redux-thunk之后，action可以是函数了。

### 2. 区分Real DOM和Virtual DOM

| **Real DOM**                   | **Virtual DOM**                |
| ------------------------------ | ------------------------------ |
| 1. 更新缓慢。                  | 1. 更新更快。                  |
| 2. 可以直接更新 HTML。         | 2. 无法直接更新 HTML。         |
| 3. 如果元素更新，则创建新DOM。 | 3. 如果元素更新，则更新 JSX 。 |
| 4. DOM操作代价很高。           | 4. DOM 操作非常简单。          |
| 5. 消耗的内存较多。            | 5. 很少的内存消耗。            |

### 3.**React有什么特点？**

React的主要功能如下：

1. 它使用**虚拟DOM** 而不是真正的DOM。
2. 它可以进行**服务器端渲染**。
3. 它遵循**单向数据流**或数据绑定。

### 4.**你了解 Virtual DOM 吗？解释一下它的工作原理。**

Virtual DOM 是一个轻量级的 JavaScript 对象，它最初只是 real DOM 的副本。它是一个节点树，它将元素、它们的属性和内容作为对象及其属性。 React 的渲染函数从 React 组件中创建一个节点树。然后它响应数据模型中的变化来更新该树，该变化是由用户或系统完成的各种动作引起的。

Virtual DOM 工作过程有三个简单的步骤。

1. 每当底层数据发生改变时，整个 UI 都将在 Virtual DOM 描述中重新渲染。

![clipboard.png](https://segmentfault.com/img/bVbqdVC?w=1363&h=499)

然后计算之前 DOM 表示与新表示的之间的差异

![clipboard.png](https://segmentfault.com/img/bVbqdVw?w=1079&h=452)

完成计算后，将只用实际更改的内容更新 real DOM。

![clipboard.png](https://segmentfault.com/img/bVbqdVr?w=531&h=457)

### 5.**为什么浏览器无法读取JSX？**

浏览器只能处理 JavaScript 对象，而不能读取常规 JavaScript 对象中的 JSX。所以为了使浏览器能够读取 JSX，首先，需要用像 Babel 这样的 JSX 转换器将 JSX 文件转换为 JavaScript 对象，然后再将其传给浏览器。





## 11.安全

### xss与csrf攻击原理和范围

## 12.协议&网络

### 同源策略

### 跨域请求

### http

### websocket



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

### 13.4在浏览器输入URL回车之后发生了什么？

大致流程：1.输入地址→2.DNS解析→3.tcp连接→4.发送http请求→5.返回http响应→6.渲染页面→7.断开连接

**一、输入地址：**

当我们在浏览器输入地址的时候，浏览器已经在只能匹配到可能得到的url了，他会从历史记录，书签等地方，找到已经输入的字符串可能对应的 url，然后给出智能提示，让你可以补全url地址。

**二、DNS解析：**

DNS解析的过程就是寻找哪台机器上有你需要资源的过程。当你在浏览器中输入一个地址时，例如http://www.baidu.com，其实不是百度网站真正意义上的地址。互联网上每一台计算机的唯一标识是它的IP地址，但是IP地址并不方便记忆。用户更喜欢用方便记忆的网址去寻找互联网上的其它计算机，也就是上面提到的百度的网址。所以互联网设计者需要在用户的方便性与可用性方面做一个权衡，这个权衡就是一个网址到IP地址的转换，这个过程就是DNS解析。

解析过程：

1. 查找浏览器缓存：因为浏览器一般会缓存DNS记录一段时间，不同浏览器的时间可能不一样，一般2-30分钟不等，浏览器去查找这些缓存，如果有缓存，直接返回IP，否则下一步。
2. 查找系统缓存：浏览器缓存中找不到IP之后，浏览器会查看本地硬盘的 hosts 文件，看看其中有没有和这个域名对应的规则，如果有的话就直接使用 hosts 文件里面的 ip 地址。
3. 如果在本地的 hosts 文件没有能够找到对应的 ip 地址，浏览器会发出一个 DNS请求到本地DNS服务器 。
4. 查询你输入的网址的DNS请求到达本地DNS服务器之后，本地DNS服务器会首先查询它的缓存记录，如果缓存中有此条记录，就可以直接返回结果，此过程是递归的方式进行查询。如果没有，本地DNS服务器还要向DNS根服务器进行查询。
5. 根DNS服务器没有记录具体的域名和IP地址的对应关系，而是告诉本地DNS服务器，你可以到域服务器上去继续查询，并给出域服务器的地址。这种过程是迭代的过程。
6. 本地DNS服务器继续向域服务器发出请求，在这个例子中，请求的对象是.com域服务器。.com域服务器收到请求之后，也不会直接返回域名和IP地址的对应关系，而是告诉本地DNS服务器，你的域名的解析服务器的地址。
7. 最后，本地DNS服务器向域名的解析服务器发出请求，这时就能收到一个域名和IP地址对应关系，本地DNS服务器不仅要把IP地址返回给用户电脑，还要把这个对应关系保存在缓存中，以备下次别的用户查询时，可以直接返回结果，加快网络访问。

DNS查询的两种方式：

1、递归解析：

当局部DNS服务器自己不能回答客户机的DNS查询时，它就需要向其他DNS服务器进行查询。此时有两种方式，如图所示的是递归方式。局部DNS服务器自己负责向其他DNS服务器进行查询，一般是先向该域名的根域服务器查询，再由根域名服务器一级级向下查询。最后得到的查询结果返回给局部DNS服务器，再由局部DNS服务器返回给客户端。

![img](https://pic2.zhimg.com/80/v2-ea4f5f5cf28a9a6e166c4fc11b37ad21_1440w.jpg)

2、迭代解析：

当局部DNS服务器自己不能回答客户机的DNS查询时，也可以通过迭代查询的方式进行解析，如图所示。局部DNS服务器不是自己向其他DNS服务器进行查询，而是把能解析该域名的其他DNS服务器的IP地址返回给客户端DNS程序，客户端DNS程序再继续向这些DNS服务器进行查询，直到得到查询结果为止。也就是说，迭代解析只是帮你找到相关的服务器而已，而不会帮你去查。![img](https://pic2.zhimg.com/80/v2-4e0687456ae11fc76b0a77fc7e55eb21_1440w.jpg)

**三、TCP连接：**

主机浏览器通过DNS解析得到了目标服务器的IP地址后，与服务器建立TCP连接。

TCP三次握手：

第一次握手：客户端将标志位SYN置为1,随机产生一个值为seq=J（J的取值范围为=1234567）的数据包到服务器，客户端进入SYN_SENT状态，等待服务端确认；

第二次握手：服务端收到数据包后由标志位SYN=1知道客户端请求建立连接，服务端将标志位SYN和ACK都置为1，ack=J+1，随机产生一个值seq=K，并将该数据包发送给客户端以确认连接请求，服务端进入SYN_RCVD状态。

第三次握手：客户端收到确认后，检查ack是否为J+1，ACK是否为1，如果正确则将标志位ACK置为1，ack=K+1，并将该数据包发送给服务端，服务端检查ack是否为K+1，ACK是否为1，如果正确则连接建立成功，完成三次握手，随后客户端A与服务端B之间可以开始传输数据了。

为什么需要三次握手：

三次握手的目的是“为了防止已失效的连接请求报文段突然又传送到了服务端，因而产生错误。

**四、发送http请求：**

建立了TCP连接之后，发起一个http请求。一个典型的 http request header 一般需要包括请求的方法，例如 GET 或者 POST 等，不常用的还有 PUT 和 DELETE 、HEAD、OPTION以及 TRACE 方法。

**五、返回http响应：**

服务器接受并处理完请求，返回 HTTP 响应，一个响应报文格式基本等同于请求报文，由响应行、响应头、空行、实体组成。

**六、浏览器解析渲染页面：**

浏览器是一个边解析边渲染的过程。首先浏览器解析HTML文件构建DOM树，然后解析CSS文件构建渲染树，等到渲染树构建完成后，浏览器开始布局渲染树并将其绘制到屏幕上。这个过程比较复杂，涉及到两个概念: reflow(回流)和repain(重绘)。DOM节点中的各个元素都是以盒模型的形式存在，这些都需要浏览器去计算其位置和大小等，这个过程称为relow;当盒模型的位置,大小以及其他属性，如颜色,字体,等确定下来之后，浏览器便开始绘制内容，这个过程称为repain。页面在首次加载时必然会经历reflow和repain。reflow和repain过程是非常消耗性能的，尤其是在移动设备上，它会破坏用户体验，有时会造成页面卡顿。所以我们应该尽可能少的减少reflow和repain。

浏览器两种渲染方式：

webkit的主要流程：![img](https://pic2.zhimg.com/80/v2-ad2b8a9617646bb212b70c556cdb5759_1440w.jpg)

**七、断开连接：**

TCP四次挥手：

第一次挥手：Client发送一个FIN，用来关闭Client到Server的数据传送，Client进入FIN_WAIT_1状态。

第二次挥手：Server收到FIN后，发送一个ACK给Client，确认序号为收到序号+1（与SYN相同，一个FIN占用一个序号），Server进入CLOSE_WAIT状态。

第三次挥手：Server发送一个FIN，用来关闭Server到Client的数据传送，Server进入LAST_ACK状态。

第四次挥手：Client收到FIN后，Client进入TIME_WAIT状态，接着发送一个ACK给Server，确认序号为收到序号+1，Server进入CLOSED状态，完成四次挥手。

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

## 面试向

1. **JavaScript 基础**，包括原型与原型链、继承、事件循环、作用域、ES6语法、垃圾回收与内存泄漏等。



2. **网络通信**，重点有浏览器缓存、Http2.0、Https通信过程、TCP与UDP、DNS解析、CDN缓存等。



3. **HTML和CSS**，这块被问的内容比较少，重点从布局入手，比如单位、盒模型、定位、响应式布局等知识点。



4. **前端框架**，框架的底层原理是一定会问的，至少要深入掌握一个前端框架。目前业界内比较流行的框架是 React 和 Vue，React 的知识点有 React diff、生命周期、Fiber 架构、Hooks 等；Vue 的知识点有Vue diff、响应式原理、Vue3.0新特性等。



5. **打包工具**，主要围绕Webpack展开，比如loader和plugin原理、webpack构建流程、热更新原理、性能优化等。除此以外，打包界的新宠esbuild也可以了解下。



6. **加分项**，除了JavaScript外，还了解哪些编程语言

### **1. 美团**

**一面**

1. 曾经做过的最有挑战的一个项目

2. DOM 的事件机制，怎么阻止事件捕获

   1.  **stopPropagation()方法既可以阻止事件冒泡，也可以阻止事件捕获，也可以阻止处于目标阶段。**

       

       

      **但是我们可以使用DOM3级新增事件stopImmediatePropagation()方法来阻止事件捕获，另外此方法还可以阻止事件冒泡。应用如下：**

      ```
      document.getElementById("second").addEventListener("click",function(){``  ``alert("second");``  ``event.stopImmediatePropagation();``},true);  
      ```

      　　这样，就可以在id为second处阻止事件的捕获了。

       

       

      **那么 stopImmediatePropagation() 和 stopPropagation()的区别在哪儿呢？**

      　　**后者只会阻止冒泡或者是捕获。 但是前者除此之外还会阻止该元素的其他事件发生，但是后者就不会阻止其他事件的发生。 [例子点击这里。](https://developer.mozilla.org/zh-CN/docs/Web/API/Event/stopImmediatePropagation)**

       

      注意：尽管这是Netscape Navigator提出的事件流，但是现在所有的浏览器都支持这种事件流模型。**但是由于老的浏览器不支持，所以很少有人使用事件捕获。**

3. 常用的 ES6 语法有哪些，var 怎么实现let

4. React Hooks vs Component

5. React中的 useCallback 和 useMemo 有什么区别，什么情况下需要用 useCallback

6. 浏览器的 Event Loop 机制

7. setState 是同步还是异步的

8. Set 的用法，用 Set 实现数组去重

9. Graphql 的使用

10. 移动端适配方案, rem 和 em 的区别

11. React 解决了什么问题

12. 前端跨域怎么做

13. 编程题：用 setTimeout 实现 setInterval



**二面**

1. Vue 的双向绑定机制
2. 字节小程序和微信小程序区别
3. React Fiber 机制
4. React Hooks 的原理
5. Node 遇到过哪些性能问题
6. Node 做耗时的计算时候，如何避免阻塞
7. 低代码平台运行时的生成逻辑
8. 低代码平台性能优化
9. 低代码平台组件发布流程
10. 上家公司做了哪些事情以及做事的流程
11. 未来职业规划
12. 感兴趣的工作方向
13. 编程题：输入两个数组 [1,2,3,2,1], [3,2,1,4,7]  返回公共的并且长度最长子数组的长度



**三面**

1. 大文件的分片上传和断点续传怎么做的
2. 抖音APP 与 H5 如何通信
3. 现在需要用新技术，需要从哪些方面思考
4. 如何针对性能指标做优化，有没有了解过业界的性能指标统计方式
5. Express 和 Koa 的区别
6. 项目经历
7. 推动过什么事情
8. 对下一份工作的期望



### **2. 商汤科技**

**一面**

1. less-loader 的 less 转成 css 的底层原理
2. webpack的 loader 和 plugin 区别
3. webpack 常用插件
4. webpack 如何做代码拆分
5. webpack tree shaking 原理
6. webpack 动态导入原理
7. webpack 热更新原理
8. webpack5 新特性
9. esm 和 commonjs 的区别
10. TS 的 type 和 interface 的区别
11. TS 怎么做枚举
12. TS 泛型
13. canvas 绘制流程，canvas 里的图片跨域怎么处理
14. 项目经历：babel 插件的实现
15. 编程题：实现一个深拷贝

**
**

**二面**

1. 链表和线性表 crud 比较
2. 了解哪些设计模式，实现其中一个设计模式
3. canvas 绘制流程，遇到了哪些问题
4. 从输入URL到浏览器显示页面过程中都发生了什么？
5. 移动端布局方案
6. 浏览器 Event Loop
7. 对图形绘制了解多少
8. ES6 为什么要转成 ES5
9. H5 开发时遇到了哪些问题，怎么定位的
10. DOM 事件流
11. 平时怎么做性能优化
12. 最有亮点的两个项目



**三面**

1. HTTPS 加解密过程
2. 哈希表原理，哈希碰撞时怎么处理
3. 内存回收机制
4. 栈内存和堆内存的概念
5. 线上错误监控怎么做
6. CI/CD 流程，有哪些改进点
7. 进程间如何通信
8. 低代码平台的实现
9. 对下一份工作的期望





### **3. 神策**

**一面**

1. CSS 预处理器对比

2. CSS 定位有哪些取值

3. 原型与原型链，函数怎么实现继承

4. this的指向，call、apply的区别

5. Vue 3.0 和 2.0 区别

6. Vue.$nextTick 作用

7. Vue 和 React 的 diff 有什么区别

8. proxy 拦截器的用法

9. DNS 解析流程

10. 事件循环

11. 闭包和内存泄漏

12. 最有亮点的一个项目 

    

**二面**

1. HTTP 幂等性定义和常用方法的幂等性
2. redux 单向数据流有哪些优势，redux 中间件实现原理
3. React HOC vs renderProps
4. 浏览器里的线程与进程
5. requestAnimationFram 与 requestIdleCallback 的区别
6. npm管理痛点，如何解决
7. gitflow流程、分支管理
8. websocket建立连接过程
9. 组件/工具库打包时的格式输出，如:CommonJS、ESM、UMD等，他们之间有什么区别
10. Http 301、302 状态码的区别
11. H5 性能优化 
12. 编程题：设计一个flat函数将如下数组arr=[1,2,['3',4,'5',[6,[7,8],9]]]输出为1,2,'3',4,'5',6,7,8,9。至少写出两种方法,要求不能改变数组中的原始数据类型



**三面**

1. BI 可视化系统介绍
2. 在字节之后的提升有哪些
3. 目前前端可以做的优化有哪些
4. 新旧系统重构的时候，怎么过渡上线
5. Vue React 的区别
6. 字节小程序介绍一下
7. 自己未来的规划。自己的优缺点、周围人人对自己的评价
8. 如何学习一门新技术
9. 对神策数据的了解
10. 对大数据的了解



### **4. 王者荣耀**

**一面**

1. 进程通信的几种方式

2. TCP/IP 如何保证传输稳定性

3. 对称加密和非对称加密的使用场景

4. 浏览器帧卡顿检测

5. Vue 和 React的设计理念

6. 性能指标FP、FCP和FMP分别跟哪些因素有关

7. 低代码平台的技术原理

8. 业界其他低代码平台实现方式，对比差异

9. nginx怎么做反向代理与负载均衡

10. 编程题：设计和实现一个 LRU (最近最少使用) 缓存机制，满足：1.获取数据 get(key) - 如果密钥 (key) 存在于缓存中，则获取密钥的值（总是正数），否则返回 -1。2.写入数据 put(key, value) - 如果密钥已经存在，则变更其数据值；如果密钥不存在，则插入该组「密钥/数据值」。

    



###  **5. 天眼查**

**一面**

1. JS 有哪些数据类型
2. JS 数据类型识别的方式，有什么缺点
3. 原型和原型链，函数怎么实现继承
4. new 发生了什么
5. symbol 类型的用法
6. script 标签里分别设置 defer 和 async， 它们的执行顺序是怎么样的
7. React router 的两种模式模式，怎么动态获取路由上的 id
8. redux 中间件的实现原理
9. React 的 purecomponent 和 component 的区别
10. generator 函数的用法
11. React diff 节点对比的过程
12. Vite 打包工具的使用
13. 箭头函数和普通函数区别
14. 什么是执行上下文
15. 堆内存和栈内存，数组存储在堆内存还是栈内存
16. HTTP2.0 相较于 HTTP1.0 的改进
17. isNaN和number.isNaN区别
18. 闭包和内存泄漏
19. setState 是同步还是异步的
20. HTTP 与 HTTPS 的区别
21. React Hooks 的 useState 为什么不能放到条件语句
22. 解释下浏览器的同源策略





### **6. 酷家乐**

**一面**

1. Node 怎么做性能监控
2. React diff 节点移动的具体过程
3. 讲一讲浏览器缓存
4. ES5 最优的一种函数继承，静态属性怎么做继承的
5. 前端怎么做性能监控
6. V8 引擎对垃圾回收的优化
7. 导致内存泄漏的方法，怎么监控内存泄漏
8. 作用域和执行上下文区别
9. this的指向问题
10. Array方法，forEach、map 对比
11. for of 和 for in 区别；for of 循环数组时怎么拿到数组索引
12. 移动端布局方案；怎么设置根元素的font-size大小的
13. Webpack bundle、chunk、module的区别
14. Webpack 热更新原理，怎么找到对应的局部模块做更新的
15. 项目经历：babel插件的实现





### **7. 中国人寿**

**一面**

1. HTTP2.0 和 HTTP1.0 的区别，HTTP2.0 有什么缺点
2. 闭包及闭包的使用场景
3. 实现一个侧边栏组件思路
4. 浏览器缓存机制
5. 重排与重绘，怎么减少重排
6. DOM 事件机制，不会冒泡的事件
7. cookie 和 session 的区别
8. sql 相关操作，增删查改
9. web 安全，xss、csrf 攻击特点及防御方式
