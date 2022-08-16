<template>
  <div>
    <ul>
      <li v-for="(item, index) in arr">{{ item }}---{{ index }}</li>
    </ul>
  </div>
</template>

<script>
export default {
  data() {
    return {
      arr: ['小张', '小李', '小赵'],
    }
  },
}
</script>

<style></style>
