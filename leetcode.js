const _quickSort = array => {
    // 补全代码
    if(array.length<=1){
        return array
    }
    var midIndex = Math.floor(array.length/2)
    var midVal = array.splice(midIndex,1)[0]
    var left = []
    var right = []
    for(let i=0,len = array.length;i<len;i++){
        if(array[i]<midVal){
            left.push(array[i])
        } else {
            right.push(array[i])
        }
    }
    return _quickSort(left).concat([midVal],_quickSort(right))
}

console.log(_quickSort([5,9,6,5,4,5,6,-1,-9,9]));