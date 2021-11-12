<template>
  <div id="detail">
    <detail-nav-bar class="detail-nav" @titleClick="titleClick" ref="nav"></detail-nav-bar>
    <scroll class="content"
            ref="scroll"
            @scroll="contentScroll"
            :probe-type="3">
      <detail-swiper :top-images="topImages"></detail-swiper>
      <detail-base-info :goods-detail="goodsDetail"></detail-base-info>
      <detail-shop-info :shop="shop"></detail-shop-info>
      <detail-goods-info :detail-info="detailInfo" @imageLoad="imageLoad"></detail-goods-info>
      <detail-param-info ref="params" :param-info="paramInfo"></detail-param-info>
      <detail-comment-info ref="comment" :comment-info="commentInfo"></detail-comment-info>
      <goods-list ref="recommend" :goods="recommends"></goods-list>
    </scroll>
    <detail-bottom-bar @addCart="addToCart"></detail-bottom-bar>

    <back-top @click.native="backTop" v-show="isShowBackTop"></back-top>
  </div>
</template>

<script>
  import DetailNavBar from "@/views/detail/childComps/DetailNavBar";
  import DetailSwiper from "@/views/detail/childComps/DetailSwiper";
  import DetailBaseInfo from "@/views/detail/childComps/DetailBaseInfo";
  import DetailShopInfo from "@/views/detail/childComps/DetailShopInfo";
  import DetailGoodsInfo from "@/views/detail/childComps/DetailGoodsInfo";
  import DetailParamInfo from "@/views/detail/childComps/DetailParamInfo";
  import DetailCommentInfo from "@/views/detail/childComps/DetailCommentInfo";
  import DetailBottomBar from "@/views/detail/childComps/DetailBottomBar";

  import Scroll from "@/components/common/scroll/Scroll";
  import GoodsList from "@/components/content/goods/GoodsList";

  import {getDetail, getRecommend, GoodsInfo, Shop, GoodsParam} from "@/network/detail";
  import {itemListenerMixin, backTopMixin} from "@/common/mixin";
  import {debounce} from "@/common/utils";

  import {mapActions} from 'vuex'

  export default {
    name: "Detail",
    components: {
      DetailNavBar,
      DetailSwiper,
      DetailBaseInfo,
      DetailShopInfo,
      DetailGoodsInfo,
      DetailParamInfo,
      DetailCommentInfo,
      DetailBottomBar,

      Scroll,
      GoodsList,
    },
    mixins: [itemListenerMixin, backTopMixin],
    data() {
      return {
        iid: null,
        res: {},
        topImages: [],
        goodsDetail: {},
        shop: {},
        detailInfo: {},
        paramInfo: {},
        commentInfo: {},
        recommends: [],
        themeTopYs: [],
        getThemeTopY: null,
        currentIndex: 0,
      }
    },
    created() {
      //1.保存传入的iid
      this.iid = this.$route.params.iid

      //2.根据iid请求详情数据
      getDetail(this.iid).then(res => {
        //1.获取顶部的图片轮播数据
        this.res = res.result
        const data = res.result
        this.topImages = data.itemInfo.topImages

        //2.获取商品信息(对服务器中传过来的数据进行整合)
        this.goodsDetail = new GoodsInfo(data.itemInfo, data.columns, data.shopInfo.services)

        //3.创建店铺信息的对象
        this.shop = new Shop(data.shopInfo)

        //4.保存商品的详情数据
        this.detailInfo = data.detailInfo

        //5.获取参数信息
        this.paramInfo = new GoodsParam(data.itemParams.info, data.itemParams.rule)

        //6.获取评论信息
        if (data.rate.cRate !== 0) {
          this.commentInfo = data.rate.list[0]
        }

        //当DOM渲染完成后再回调该函数
        //但不包含图片的高度
        this.$nextTick(() => {
          this.themeTopYs = []
          this.themeTopYs.push(0)
          this.themeTopYs.push(this.$refs.params.$el.offsetTop)
          this.themeTopYs.push(this.$refs.comment.$el.offsetTop)
          this.themeTopYs.push(this.$refs.recommend.$el.offsetTop)

        })
      })

      //3.请求推荐数据
      getRecommend().then(res => {
        this.recommends = res.data.list
      })

      //4.给getThemeTopY赋值(debounce进行防抖)
      this.getThemeTopY = debounce(() => {
        this.themeTopYs = []
        this.themeTopYs.push(0)
        this.themeTopYs.push(this.$refs.params.$el.offsetTop)
        this.themeTopYs.push(this.$refs.comment.$el.offsetTop)
        this.themeTopYs.push(this.$refs.recommend.$el.offsetTop)
        this.themeTopYs.push(Number.MAX_VALUE)

      }, 100)
    },
    methods: {
      ...mapActions({
        addCart: 'addCart',
      }),
      imageLoad() {
        //在所有图片加载完成后刷新页面高度(该refresh在mixin中已经使用过防抖函数)
        this.refresh()

        //在所有图片加载完成后给getThemeTopY赋值
        this.getThemeTopY()
      },
      //顶部导航栏点击事件
      titleClick(index) {
        this.$refs.scroll.scrollTo(0, -this.themeTopYs[index] + 44, 500)
      },
      contentScroll(position) {
        //1.获取y值
        const positionY = -position.y

        //2.与ThemeY中的值进行对比
        let length = this.themeTopYs.length
        for (let i = 0; i < length - 1; i++) {
          if (this.currentIndex !== i && (positionY >= this.themeTopYs[i] -44 && positionY < this.themeTopYs[i+1])) {
            this.currentIndex = i
            this.$refs.nav.currentIndex = this.currentIndex
          }

          /*if(this.currentIndex !== i) {
            if(i < length - 1) {
              if (positionY >= this.themeTopYs[i] -44 && positionY < this.themeTopYs[i+1]) {
                this.currentIndex = i
                this.$refs.nav.currentIndex = this.currentIndex
              }
            }else {
              if (positionY >= this.themeTopYs[i] -44) {
                this.currentIndex = i
                this.$refs.nav.currentIndex = this.currentIndex
              }
            }
          }*/
        }

        this.listenShowBackTop(position)

      },
      addToCart() {
        //1.获取购物车需要展示的信息
        const product = {}
        product.image = this.topImages[0]
        product.title = this.goodsDetail.title
        product.desc = this.goodsDetail.desc
        product.price = this.goodsDetail.realPrice
        product.iid = this.iid

        //2.将商品添加到购物车中
        // this.$store.commit('addCart', product)
        this.addCart(product).then(res => {
          this.$toast.show(res, 1500)
        })
      }
    },
    destroyed() {
      this.$bus.$off('goodsItemImageLoad', this.itemImgListener)
    }
  }
</script>

<style scoped>
/*  为了进入详情页后将下方导航条盖住，需要给detail设置样式  */
  #detail {
    height: 100vh;
    position: relative;
    z-index: 9;
    background-color: #fff;
  }

  .detail-nav {
    position: relative;
    z-index: 9;
    background-color: #fff;
  }

  .content {
    height: calc(100% - 44px - 58px);
  }
</style>
