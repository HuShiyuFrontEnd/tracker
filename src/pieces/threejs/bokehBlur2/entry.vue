<template>
  <div class="tracker-piece-entry">
    <div ref="container" class="container" />
  </div>
</template>

<script>
import props from './config'
import Scene from './scene'

export default {
  name: 'BokehBlur',
  props,
  data() {
    return {
      scene: null
    }
  },
  watch: {
    focus(value) {
      this.scene.changeParams('focus', value)
    },
    aperture(value) {
      this.scene.changeParams('aperture', value)
    }
  },
  mounted() {
    this.$emit('config', props)
    this.$nextTick(() => {
      // this.scene = new Scene({ container: this.$refs.container, params: {}})
    })
  },
  update() {
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
      this.scene = new Scene({ container: this.$refs.container, params: {}})
    }
  }
}
</script>

<style lang="scss" scoped>
  .tracker-piece-entry{
    position: relative;
    width: 100%;
    height: 100%;
    .container{
      width: 100%;
      height: 100%;
    }
  }
</style>
