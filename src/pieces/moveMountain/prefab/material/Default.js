// 我们假定材质是这样的一组描述：
// 入射光打到一个表面，发生镜面发射和漫反射
export default class DefaultMaterial {
  // 基色
  _baseColor = [0.0, 0.0, 0.0]
  get baseColor() { return this._baseColor }
  set baseColor(color) {
    this._baseColor = color
  }

  // 金属性，表面有多像金属表面
  _metallic = 0
  get metallic() { return this._metallic }
  set metallic(metallic) {
    this._metallic = metallic
  }

  constructor({
    baseColor = [0.0, 0.0, 0.0],
    metallic = 0
  }) {
    this.baseColor = baseColor
    this.metallic = metallic
  }
}
