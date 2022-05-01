<template>
  <div>
    <!-- 插值表达式: 双大括号, 可以把vue数据变量直接显示在标签内 -->
    <h1>{{ msg }}</h1>
    <h2>{{ obj.name }}</h2>
    <h3>{{ obj.age > 18 ? '成年' : '未成年' }}</h3>
  </div>
</template>

<script>
export default {
  // Vue中变量声明在哪里? data函数返回的对象上, 用key属性声明
  data() {
    return {
      msg: 'hello,vue',
      obj: {
        name: '小vue',
        age: 25,
      },
    }
  },
}
</script>

<style></style>
