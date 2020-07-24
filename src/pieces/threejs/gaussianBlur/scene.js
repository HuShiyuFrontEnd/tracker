import {
  WebGLRenderer, PerspectiveCamera, OrthographicCamera, Scene, Color, AxisHelper, Fog, Vector2, TextureLoader,
  AmbientLight, DirectionalLight, SpotLight,
  Object3D, BoxGeometry, SphereBufferGeometry, PlaneBufferGeometry, MeshPhongMaterial, MeshLambertMaterial, MeshBasicMaterial, Mesh
} from '@/lib/three.module.js'
import { EffectComposer } from '@/lib/postprocessing/EffectComposer'
import { RenderPass } from '@/lib/postprocessing/RenderPass'
import { ShaderPass } from '@/lib/postprocessing/ShaderPass'
// import { DotScreenShader } from '@/lib/shaders/DotScreenShader'
// import { RGBShiftShader } from '@/lib/shaders/RGBShiftShader'
import { GaussianBlurShader } from './index'

export default class MainScene {
  constructor({ container }) {
    this.container = container

    this.initScenes()
    this.addSceneThings()
    this.addComposer()
    window.addEventListener('resize', this.onResize)

    this.update()
  }

  onResize = this.onResizeFunc.bind(this)
  onResizeFunc() {
    const bound = this.container.getBoundingClientRect()
    this.width = bound.width
    this.height = bound.height

    this.camera.aspect = bound.width / bound.height
    this.camera.updateProjectionMatrix()

    this.renderer.setSize(bound.width, bound.height)
    this.composer.setSize(bound.width, bound.height)
  }

  initScenes() {
    const bound = this.container.getBoundingClientRect()
    this.width = bound.width
    this.height = bound.height

    this.renderer = new WebGLRenderer()
    this.renderer.setPixelRatio(window.devicePixelRatio)
    this.renderer.setSize(bound.width, bound.height)
    this.renderer.setClearColor(new Color(0xFFFFFF))
    this.container.appendChild(this.renderer.domElement)

    this.scene = new Scene()
    this.scene.fog = new Fog(0x000000, 1, 1000)

    const aspect = this.width / this.height
    this.camera = new OrthographicCamera(-aspect, aspect, 1, -1, 0, 1)
    // this.camera.position.set(0, 20, 0)
    // this.camera.lookAt(this.scene.position)

    this.scene.add(new AmbientLight(0x222222))

    const light = new DirectionalLight(0xffffff)
    light.position.set(10, 10, 10)
    this.scene.add(light)

    // const axes = new AxisHelper(20)
    // this.scene.add(axes)
  }

  //
  refresh(container) {
    this.container.removeChild(this.renderer.domElement)
    this.container = container
    this.container.appendChild(this.renderer.domElement)
  }

  addSceneThings() {
    this.main = new Object3D()
    this.scene.add(this.main)

    const texture = new TextureLoader().load('/public/img/night.jpg')
    const geometry = new PlaneBufferGeometry(2 * this.width / this.height, 2)
    const material = new MeshBasicMaterial({
      map: texture
    })

    const mesh = new Mesh(geometry, material)
    // mesh.rotation.x = Math.PI * -0.5

    this.main.add(mesh)
  }

  addComposer() {
    // 将画布内的内容绘制到RenderPass这个VBO里面，然后传递个下一个后处理
    this.composer = new EffectComposer(this.renderer)
    this.composer.addPass(new RenderPass(this.scene, this.camera))

    const kernelRadius = 50
    const sigma = 50

    const gaussianBlurHorizontal = new ShaderPass(GaussianBlurShader)
    gaussianBlurHorizontal.uniforms.tSize.value = new Vector2(this.width, this.height)
    gaussianBlurHorizontal.uniforms.direction.value = new Vector2(1.0, 0.0)
    gaussianBlurHorizontal.uniforms.kernelRadius.value = kernelRadius
    gaussianBlurHorizontal.uniforms.sigma.value = sigma
    this.composer.addPass(gaussianBlurHorizontal)

    const gaussianBlurVertical = new ShaderPass(GaussianBlurShader)
    gaussianBlurVertical.uniforms.tSize.value = new Vector2(this.width, this.height)
    gaussianBlurVertical.uniforms.direction.value = new Vector2(0.0, 1.0)
    gaussianBlurVertical.uniforms.kernelRadius.value = kernelRadius
    gaussianBlurVertical.uniforms.sigma.value = sigma
    this.composer.addPass(gaussianBlurVertical)
  }

  update = this.updateFunc.bind(this)
  updateFunc() {
    // this.renderer.render(this.scene, this.camera)
    this.composer.render()

    this._tick = requestAnimationFrame(this.update)
  }

  destroy() {
    cancelAnimationFrame(this._tick)
    window.removeEventListener('resize', this.onResize)
  }
}