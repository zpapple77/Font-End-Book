//一句话总结promise设计原理：resolve，reject两个函数控制promise内部的状态，
// promise.then()根据状态执行不同的逻辑，实现异步

// step.1
//封装一个构造函数myPromise,但其设定一个内部状态status,有三种取值,分别对应promise
//的三种状态,设定一个内部对象data，用于存储promise对象当前的值

// step.2
// 给构造函数myPromise添加两个方法 resolve, reject

// step.3 
// myPromise构造函数的原型上（实例上）添加一个then方法
// 说明：根据promise/A+规范，每一个promise实例都有一个then方法

// step.4
// then函数接收两个参数，onFulfilled(onResolved)，onRejected
// 说明：为什么要接收两个参数，
// 根据promise/a+规范，then方法最终都要返回一个promise，在then方法执行过程中，需要解析当前promise对象的状态，以
// 及向下一个promise对象传值，如果是pending，不做解析，另外两种状态在设置后会去执行对应状态的队列函数，所以then要接收
// 两个函数，以放到各自的队列函数中

//  step.5
// then方法处理fulfilled, failed状态
// 说明：then方法返回的是promise函数，如果promise.then(onFulfilled(onResolved)，onRejected)调用then方法，
// 这时的状态会是fulfilled或者failed，此时是promise.then(onFulfilled(onResolved)，onRejected)返回的promise的
// 调用then，这时针对不同的状态做不同的逻辑处理

//  step.6
// 调用then方法后，获取promise对象中的data是被then中的回调函数onFulfilled(onResolved)，onRejected处理后的值
// 说明：链式调用后面的then需要用到前面then方法回调函数处理的返回值

//  step.7
// 由于then方法需要在resolve后异步执行，所以要设置两个全局状态队列onResolvedCallback ，onRejectedCallback 

//  step.8
// 在resolve(data)时，状态并没有立即改变，所以resolve函数内部要设置为异步调用，即使用setTimeout(), reject同理
// 说明：针对7，8：
// 在创建promise对象时，设置resolve或者reject后会在异步队列中放入异步任务，更改状态，执行对应队列函数；
// 创建对象后，then同步调用，优先将onFulfilled(onResolved)或者onRejected放入队列中（这里先考虑同步调用）


//手动实现promise
function myPromise(cb){  //参数为一个函数，接收resolve, reject两个参数
    const self = this;
    self.status = 'pending';
    self.data = undefined;
    self.onResolvedCallback = [];
    self.onRejectedCallback = [];
    function resolve(value){
        console.log('我是同步的resolve')
        setTimeout(() => {  //这里异步执行，否则会直接执行掉
            console.warn('开始执行异步resolve')
            if(self.status == 'pending'){
                self.status = 'fulfilled'
                self.data = value;
                console.log(self.onResolvedCallback)
                self.onResolvedCallback.map(item => {item(value)})
            }
        })
        
    }
    function reject(reason){
        setTimeout(() => {
          if(self.status == 'pending'){
            self.status = 'failed'
            self.data = reason;
            self.onResolvedCallback.map(item => {item(value)})
          }
        })
    }
    try  {
        cb(resolve,reject)
    } catch(e) {
        reject(e)
    }
}
//基本的then方法
// myPromise.prototype.then = function(onResolve, onReject){
//     this.onResolvedCallback.push(onResolve);
//     this.onRejectedCallback.push(onReject)
// }
//由于then要返回Promise对象，所以对then方法进行如下改造
myPromise.prototype.then = function(onResolved,onRejected){
    console.log('我是promise的then')
    const self = this;
    let promise2;
    //判断是不是onResolved,onRejected函数
    onResolved = typeof onResolved === 'function' ? onResolved : value => value;
    onRejected = typeof onRejected === 'function' ? onRejected : value => value;
    //判断promise对象的当前状态
    if(self.status == 'fulfilled'){
        console.log('异步调用promise或者多次调用，这里已经解析了')
        promise2 = new myPromise(function(resolve,reject){
            try{
                let x = onResolved(self.data)
                //判断onResolved是否返回一个myMromise对象
                if(x instanceof myPromise){
                    x.then(resolve,reject)
                } else {
                    resolve(x)
                }
            }catch(e){
                reject(e)
            }
        })
        return promise2;
    }
    if(self.status == 'failed'){
        promise2 = new myPromise(function(resolve,reject){
            try{
                let x = onRejected(self.data)
                if(x instanceof myPromise){
                    x.then(resolve,reject)
                } else {
                    resolve(x)
                }
            }catch(e){
                reject(e)
            }
        })
    }
    //promise对象当前状态为pending，此时并不能确定调用onResolved还是onRejected，需要等当前Promise状态确定。
    
    if(self.status == 'pending'){
        promise2 = new myPromise(function(resolve, reject){
            //向数组添加函数并不会执行该函数，执行过push同步任务后，会执行异步任务setTimeout
            self.onResolvedCallback.push(function(value){
                try{
                    // console.error('我是promise的pending状态',self.status)
                    // console.log('pending状态下的self.data',self.data)
                    let x = onResolved(self.data)
                    if(x instanceof myPromise){
                        x.then(resolve,reject)
                    }else{
                        console.log('x不是 promise:',x)
                        resolve(x)
                    }
                }catch(e){
                    reject(e)
                }
            })

            self.onRejectedCallback.push(function(value){
                try{
                    let x = onRejected(self.data)
                    if(x instanceof myPromise){
                        x.then(resolve,reject)
                    }else{
                        resolve(x)
                    }
                }catch(e){
                    reject(e)
                }
            })
            
        })
        return promise2
    }

}
