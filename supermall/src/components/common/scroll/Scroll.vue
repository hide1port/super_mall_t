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
    props: {
      probeType: {
        type: Number,
        default: 0
      },
      pullUpLoad : {
        type: Boolean,
        default: false
      },
    },
    data() {
      return {
        scroll: null
      }
    },
    mounted() {
      //使用 ref 获取防止其他地方也设置了 class 为 wrapper
      //1.创建 BScroll 对象
      this.scroll = new BScroll(this.$refs.wrapper, {
        //使得scroll组件中的对象可以被点击
        click: true,
        //让应用该组件的父组件决定是否需要 监测滚动
        probeType: this.probeType,
        //让应用该组件的父组件决定是否需要 上拉加载更多
        pullUpLoad: this.pullUpLoad
      })

      //2.监听滚动的位置
      if(this.probeType === 2 || this.probeType === 3) {
        this.scroll.on('scroll', (position) => {
          //向外传递position信息
          this.$emit('scroll', position)
        })
      }

      //3.监听scroll滚动到底部
      if(this.pullUpLoad) {
        this.scroll.on('pullingUp', () => {
          //向父组件传递 “到达底部加载更多” 事件
          this.$emit('pullingUp')
        })
      }

    },
    methods: {
      scrollTo(x, y, time) {
        this.scroll && this.scroll.scrollTo(x, y, time)
      },
      finishPullUp() {
        this.scroll && this.scroll.finishPullUp()
      },
      refresh() {
        this.scroll && this.scroll.refresh()
      },
      getScrollY() {
        return this.scroll.y
      }
    },
  }
</script>

<style scoped>

</style>
