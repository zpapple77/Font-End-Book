<template>
  <!-- 遇到复选框，v-model的变量值
        非数组  关联的是复选框的checked属性
        数组   关联的是复选框的value属性
   -->
  <div>
    <div>
      <span>来自于</span>
      <!-- 下拉菜单要绑定再select上 -->
      <select v-model="from">
        <option value="北京">北京</option>
        <option value="湖北">湖北</option>
        <option value="上海">上海</option>
      </select>
    </div>
    <div>
      <span> 爱好： </span>
      <input type="checkbox" v-model="hobby" value="lol" />lol
      <input type="checkbox" v-model="hobby" value="看书" />看书
      <input type="checkbox" v-model="hobby" value="学习" />学习
    </div>
    <div>
      <span>性别：</span>
      <input type="radio" value="男" name="sex" v-model="gender"/>男
      <input type="radio" value="女" name="sex" v-model="gender"/>女
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      from: '',
      hobby: [],
      gender: '',
    }
  },
}
</script>

<style></style>
