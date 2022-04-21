var nums = [8,9,7,6,4,5,3,6,1,9]
var partSort = (nums,start,end)=>{
    const part = nums.splice(start, end - start + 1)
    part.sort()
    nums.splice(start,0,...part)
}
partSort(nums,0,10)
console.log(nums);