var firstMissingPositive = function (nums) {
  let set = new Set(nums)
//   console.log(set)
  for (var i = 1; i < nums.length; i++) {
    if (set.has(i)) {
        console.log(i);
      
    }else{
        return i
    }
  }
}

console.log(firstMissingPositive([1, 2, 0]))
