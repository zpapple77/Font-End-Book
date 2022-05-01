<template>
  <div>
    <h1 v-show="isShow">我是h1</h1>
    <h2 v-if="isOk">我是h2</h2>
    <!-- 
        v-show隐藏：采用display：none
        v-if隐藏：采用从dom树直接移除
     -->
     <!-- v-if和v-else -->
     <p v-if="age>=18">成年人</p>
     <p v-else>未成年</p>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isShow: false,
      isOk: false,
      age:15
    }
  },
}
</script>

<style></style>
