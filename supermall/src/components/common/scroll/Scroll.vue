<template>
  <div class="wrapper" ref="wrapper">
    <div class="content">
      <slot></slot>
    </div>
  </div>
</template>

<script>
  import BScroll from "better-scroll"

  export default {
    name: "Scroll",
    data() {
      return {
        scroll: null
      }
    },
    mounted() {
      //使用 ref 获取防止其他地方也设置了 class 为 wrapper
      this.scroll = new BScroll(this.$refs.wrapper, {

      })
    }
  }
</script>

<style scoped>

</style>
