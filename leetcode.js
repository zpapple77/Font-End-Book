function ListNode(val, next) {
  this.val = val === undefined ? 0 : val
  this.next = next === undefined ? null : next
}
/**
 * @param {ListNode} head
 * @return {ListNode}
 */
var sortList = function (head) {
  let dummy = new ListNode(0, head)
  let q = head.next
  while (q !== null) {
    let p = dummy
    while (p !== null && p.next !== q) {
      if (p.next.val > q.val) {
        let tmp = q.next
        q.next = p.next
        p.next = q
        q = tmp
        break
      }
    }
  }
  return dummy.next
}
