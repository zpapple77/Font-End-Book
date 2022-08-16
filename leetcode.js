function longestWPI(hours) {
  let addList = [0]
  for (let i = 0; i < hours.length; i++) {
    addList.push(hours[i] > 8 ? addList[i] + 1 : addList[i] - 1)
  }
  console.log(addList)
  let res = 0
  let n = addList.length
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      if (j > i && addList[j] - addList[i] > 0) {
        res = Math.max(res, j - i)
      }
    }
  }
  return res
}

console.log(longestWPI([9, 9, 6, 0, 6, 6, 9]))
