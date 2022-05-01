<template>
  <div>
    <!-- v-text不会识别标签原样输出 -->
    <p v-text="str"></p>
    <!-- v-html会把标签识别成为标签 -->
    <p v-html="str">{{20+10}}</p>
    <!-- v-html或者v-text会覆盖插值表达式 -->
  </div>
</template>

<script>
export default {
  data() {
    return {
      str: '<span>我是一个span</span>',
    }
  },
}
</script>

<style></style>
