import { clear, clearBuffer } from '@luma.gl/webgl'
// import { setParameters } from '@luma.gl/gltools'

export class Pass {
  constructor({
    onInitialize = () => {},
    onRender = () => {},
    onOutput = () => { return {} },
    onClear = () => {},
    onDestroy = () => {},
    pointers = {},
    clearSettings = {},
    target = null
  }) {
    this.onInitialize = onInitialize
    this.onRender = onRender
    this.onOutput = onOutput
    this.onDestroy = onDestroy
    this.onClear = onClear

    this.clearSettings = clearSettings
    this.target = target
    Object.assign(this.pointers, pointers)
  }

  pointers = {}
  initThings = {}
  renderThings = {}
  init({ gl }) {
    if (typeof this.target === 'function') this.target = this.target(gl)
    this.initThings = this.onInitialize(Object.assign({ gl }, this.pointers))
  }

  render(params) {
    const { gl } = params
    const { depth = true, stencil = false, color = [0, 0, 0, 0], value = [0, 0, 0, 0] } = this.clearSettings
    if (this.target) {
      clearBuffer(gl, { framebuffer: this.target, value })
    } else clear(gl, { color, depth, stencil, framebuffer: this.target })

    this.renderThings = this.onRender(Object.assign({ target: this.target }, params, this.initThings, this.pointers))

    this.output = this.onOutput(Object.assign({ target: this.target }, params, this.initThings, this.pointers)) || {}
  }

  clear(params) {
    this.onClear(Object.assign(params, this.renderThings))
  }

  destroy() {
    this.onDestroy(this.initThings)

    for (const key in this.pointers) {
      delete this.pointers[key]
    }
    this.target = null
  }
}
