<template>
  <div class="tracker-piece-entry">
    <div ref="container" class="container" />
  </div>
</template>

<script>
import props from './config'
import Scene from './scene.js'

export default {
  name: 'GaussianBlur',
  props,
  data() {
    return {
      scene: null
    }
  },
  watch: {
    kernelRadius(val) {
      if (this.scene) this.scene.changeParams('kernelRadius', val)
    },
    sigma(val) {
      if (this.scene) this.scene.changeParams('sigma', val)
    },
    image(val) {
      if (this.scene) this.scene.changeParams('image', val)
    }
  },
  mounted() {
    this.$emit('config', props)
  },
  update() {
    // console.log('udpate')
  },
  beforeDestroy() {
    if (this.scene) {
      this.scene.destroy()
      this.scene = null
    }
  },
  methods: {
    onEnterEnd() {
      // 完全进入且动画结束的钩子
      this.scene = new Scene({ container: this.$refs.container, params: { image: this.image, kernelRadius: this.kernelRadius, sigma: this.sigma }})
    }
  }
}
</script>

<style lang="scss" scoped>
  .tracker-piece-entry{
    position: relative;
    width: 100%;
    height: 100%;
    background-color: #000;
    .container{
      width: 100%;
      height: 100%;
    }
  }
</style>
