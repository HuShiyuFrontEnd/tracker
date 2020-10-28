import { Pass } from './Pass'
import { RectProcessModel } from '../../common/models/RectProcessModel'
import { constantValue } from '../../common/modules/constant'

export class ShaderPass extends Pass {
  constructor({ fs, modules = [], render = () => {}, onOutput, target, clear }) {
    super({
      pointers: {
        render
      },
      onInitialize: ({ gl }) => {
        const model = new RectProcessModel(gl, {
          is2: true,
          fs,
          modules: [constantValue].concat(modules)
        })
        return { model }
      },
      onRender({ model, gl, time, extraUniforms }) {
        for (const key in extraUniforms) {
          model.uniforms[key] = extraUniforms[key]
        }
        render({ model, gl, time, extraUniforms })
      },
      onDestroy({ model }) {
        model.delete()
      },
      onOutput,
      target,
      clear
    })
  }
}
