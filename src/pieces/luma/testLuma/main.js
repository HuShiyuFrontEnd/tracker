import { AnimationLoop, Model } from '@luma.gl/engine'
import { clear } from '@luma.gl/webgl'
import { RectProcessModel } from '../common/models/RectProcessModel'
import { constantValue } from '../common/modules/constant'

export default function() {
  return new AnimationLoop({
    onInitialize({ gl }) {
      const model = new RectProcessModel(gl, {
        fs: `
          precision highp float;

          varying vec2 uv;
        
          void main(void) {
            gl_FragColor = vec4(vec3(length(uv * 0.7)), f1);
          }
        `,
        modules: [constantValue]
      })

      return { model }
    },
    onRender({ gl, model }) {
      clear(gl, { color: [0, 0, 0, 1] })
      model.draw()
    }
  })
}
