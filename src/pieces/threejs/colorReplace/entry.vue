<template>
  <div class="tracker-piece-entry">
    <!-- 这里开始后续都可以清理 -->
    <div ref="title" class="tracker-piece-title">
      colorReplace图片颜色替换
    </div>
    <div ref="content" class="tracker-piece-container">
      <div class="start">
        这是一个空白项目，现在，开始你的全新研究吧
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ColorReplace',
  props: {},
  data() {
    return {
    }
  },
  mounted() {
  },
  beforeDestroy() {
  },
  methods: {
    onEnterEnd() {
      // 完全进入且动画结束的钩子
    }
  }
}
</script>

<style lang="scss">
  .tracker-piece-entry{
    position: relative;
    width: 100%;
    height: 100%;
    /* 这里开始后续都可以清理 */
    padding: 56px 8px 8px 8px;
    .tracker-piece-title{
      position: absolute;
      top: 8px;
      left: 16px;
      height: 40px;
      line-height: 40px;
      color: #fff;
      font-size: 24px;
      text-shadow: 0px 0px 2px rgba(0, 0, 0, 0.5);
    }
    .tracker-piece-container{
      position: relative;
      width: 100%;
      height: 100%;
      left: 0px;
      background-color: rgba(255, 255, 255, 0.8);
      padding: 16px;
      .start{
        font-size: 20px;
      }
    }
  }
</style>
