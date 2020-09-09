import {
  WebGLRenderer, PerspectiveCamera, OrthographicCamera, Scene, Color, AxisHelper, Fog, Vector2, TextureLoader,
  AmbientLight, DirectionalLight, SpotLight,
  Object3D, BoxGeometry, SphereBufferGeometry, PlaneBufferGeometry, MeshPhongMaterial, MeshLambertMaterial, MeshBasicMaterial, ShaderMaterial, Mesh
} from '@/lib/three.module.js'
import { MapControls } from '@/lib/OrbitControls.js'
import { EffectComposer } from '@/lib/postprocessing/EffectComposer'
import { RenderPass } from '@/lib/postprocessing/RenderPass'
import { ShaderPass } from '@/lib/postprocessing/ShaderPass'

export default class MainScene {
  constructor({ container, params }) {
    this.container = container
    this.params = params

    this.initScenes()
    this.addSceneThings()
    this.addComposer()
    window.addEventListener('resize', this.onResize)

    this._startTime = Date.now()
    this.update()
  }

  onResize = this.onResizeFunc.bind(this)
  onResizeFunc() {
    const bound = this.container.getBoundingClientRect()
    this.width = bound.width
    this.height = bound.height

    this.camera.aspect = bound.width / bound.height
    this.camera.updateProjectionMatrix()

    this.material.uniforms.u_resolution.value = new Vector2(bound.width, bound.height)

    this.renderer.setSize(bound.width, bound.height)
    this.composer.setSize(bound.width, bound.height)
  }

  initScenes() {
    const bound = this.container.getBoundingClientRect()
    this.width = bound.width
    this.height = bound.height

    this.renderer = new WebGLRenderer({
      preserveDrawingBuffer: true
    })
    this.renderer.setPixelRatio(window.devicePixelRatio)
    this.renderer.setSize(bound.width, bound.height)
    this.renderer.setClearColor(new Color(0xFFFFFF))
    this.container.appendChild(this.renderer.domElement)

    this.scene = new Scene()
    // this.scene.fog = new Fog(0x000000, 1, 1000)

    const aspect = this.width / this.height
    this.camera = new PerspectiveCamera(75, this.width / this.height, 0.1, 1000)
    this.camera.position.set(0, 400, 400)
    this.camera.lookAt(this.scene.position)

    this.scene.add(new AmbientLight(0x222222))

    const light = new DirectionalLight(0xffffff)
    light.position.set(10, 10, 10)
    this.scene.add(light)

    // const axes = new AxisHelper(20)
    // this.scene.add(axes)

    this.controls = new MapControls(this.camera, this.renderer.domElement)

    // controls.addEventListener( 'change', render ); // call this only in static scenes (i.e., if there is no animation loop)

    this.controls.enableDamping = true // an animation loop is required when either damping or auto-rotation are enabled
    this.controls.dampingFactor = 0.05

    this.controls.screenSpacePanning = false

    this.controls.minDistance = 10
    this.controls.maxDistance = 1000

    this.controls.maxPolarAngle = Math.PI / 2
  }

  //
  refresh(container) {
    this.container.removeChild(this.renderer.domElement)
    this.container = container
    this.container.appendChild(this.renderer.domElement)
  }

  changeParams(key, value) {
  }

  addSceneThings() {
    this.main = new Object3D()
    this.scene.add(this.main)

    const planeGeo = new PlaneBufferGeometry(1000, 1000, 1, 1)
    const planeMat = new MeshBasicMaterial({ color: 0x999999 })
    const planeMesh = new Mesh(planeGeo, planeMat)
    planeMesh.rotation.x = Math.PI * -0.5
    this.main.add(planeMesh)

    const boxGeo = new BoxGeometry(50, 200, 50)
    const boxMat = new MeshBasicMaterial({ color: 0xbbbbbb }) // new ShaderMaterial(background)
    const mesh = new Mesh(boxGeo, boxMat)
    mesh.position.y = 100

    this.main.add(mesh)
  }

  addComposer() {
    // 将画布内的内容绘制到RenderPass这个VBO里面，然后传递个下一个后处理
    this.composer = new EffectComposer(this.renderer)
    this.composer.addPass(new RenderPass(this.scene, this.camera))

    // const boxBlurHorizontal = new ShaderPass(BoxBlurShader)
    // this.blurs.push(boxBlurHorizontal)
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