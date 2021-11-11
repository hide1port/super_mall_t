//混入，使得代码复用
import {debounce} from "@/common/utils";
import BackTop from "@/components/content/backTop/BackTop";
import {BACK_POSITION} from "@/common/const";

//3.监听item中图片加载完成
export const itemListenerMixin = {
  data() {
    return {
      itemImgListener: null,
      refresh: null,
    }
  },
  /*
  * 由于better-scroll计算整个可滚动高度是与图片加载同步，
  * 因此会出现由于图片未加载完全而高度已经被计算，
  * 从而导致不能完全滚动整个图片区域，
  * 所以需要监听每张图片并同时重新计算可滚动高度即可
  *
  * 同时有关 $refs 的请求都拿到 mounted() 中来做
  * */
  mounted() {
    this.refresh = debounce(this.$refs.scroll.refresh, 100)

    this.itemImgListener = () => {
      this.refresh()
    }

    this.$bus.$on('goodsItemImageLoad', this.itemImgListener)
  }
}

//返回顶部事件的抽取
export const backTopMixin = {
  components: {
    BackTop
  },
  data() {
    return {
      isShowBackTop: false,
    }
  },
  methods: {
    backTop() {
      this.$refs.scroll.scrollTo(0,0,300)
    },
    listenShowBackTop (position) {
      this.isShowBackTop = -position.y > BACK_POSITION
    },
  },
}
