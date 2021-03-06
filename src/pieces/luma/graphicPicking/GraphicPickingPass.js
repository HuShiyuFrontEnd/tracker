// 一个用于测试graphic picking的pass
import { Model } from '@luma.gl/engine'
import { Buffer } from '@luma.gl/webgl'
import { Pass } from '@/pieces/luma/common/pass'
import { createHandyBuffer } from '@/pieces/luma/common/utils'
import GL from '@luma.gl/constants'

export default new Pass({
  onInitialize: ({ gl }) => {
    const positionBuffer = new Buffer(gl, new Float32Array([
      -0.2, -0.2,
      0.2, -0.2,
      0.2, 0.2
    ]))

    const offsetBuffer = new Buffer(gl, new Float32Array([
      0.5, 0.5,
      -0.5, 0.5,
      0.5, -0.5,
      -0.5, -0.5
    ]))

    const indexBuffer = new Buffer(gl, new Float32Array([
      1, 2, 3, 4
    ]))

    const model = new Model(gl, {
      vs: `#version 300 es

        layout (location = 0) in vec2 position;
        layout (location = 1) in vec2 offset;
        layout (location = 2) in float index;

        out float v_index;

        void main() {
          v_index = index;
          gl_Position = vec4(position + offset, 0.0, 1.0);
        }
      `,
      fs: `#version 300 es
        in float v_index;

        layout (location = 0) out uint index;

        void main() {
          index = uint(round(v_index));
        }
      `,
      attributes: {
        position: positionBuffer,
        offset: [offsetBuffer, { divisor: 1 }],
        index: [indexBuffer, { divisor: 1 }]
      },
      vertexCount: 3,
      instanceCount: 4,
      instanced: true
    })

    return { model }
  },
  onRender: ({ model, gl, pos, target }) => {
    gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight)
    target.resize({ width: gl.drawingBufferWidth, height: gl.drawingBufferHeight })

    // if (pos) model.uniforms.u_pos = [pos.x, pos.y]
    model.draw({ framebuffer: target })

    gl.bindFramebuffer(GL.READ_FRAMEBUFFER, target._handle)
    gl.readBuffer(GL.COLOR_ATTACHMENT0)
    if (pos) {
      const pixels = new Uint16Array(1)
      // 兼容性考虑可以使用GL.RGBA8I
      // console.log(gl.drawingBufferWidth, gl.drawingBufferHeight, pos)
      gl.readPixels(pos.x * gl.drawingBufferWidth, (1 - pos.y) * gl.drawingBufferHeight, 1, 1, GL.RED_INTEGER, GL.UNSIGNED_SHORT, pixels)
      return { index: pixels[0] }
    }
  },
  onClear: ({ pools, index }) => {
    pools.selectingIndex = index || 0
  },
  clearSettings: { value: new Uint32Array([0, 0, 0, 0]) },
  target: (gl) => {
    const { buffer } = createHandyBuffer(gl, [{ format: 'i16c1' }])
    return buffer
  }
})
