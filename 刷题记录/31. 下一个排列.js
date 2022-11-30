function clim(n){
  //输出爬楼梯有多少种爬法
  let p = 0, q = 0,r=1
  for(let i = 0;i<n;i++){
    p =q
    q = r
    r = p+q
  }
  return r
}

console.log(clim(4));