class ParticleSystem {
  id?: number
  _startTime?: number
  _emitter?: any
  mesh?: any
  position: any
  color: any
  size?: number
  angel?: number
  opacity?: number
  alive?: number
  sizeTween: any
  colorTween: any
  opacityTween: any
  velocity: any
  acceleration: any
  angle: any
  angleVelocity: any
  angleAcceleration: any
  age?: number
  isObject3D?: boolean

  constructor(params?: object) {
    Object.assign(this, params)
  }

  get emitter() {
    return this._emitter
  }

  set emitter(val) {
    this._emitter = val
    this.mesh = this._emitter.mesh
  }

  update() {
    const now = +new Date
    const dt = (now - this._startTime!) / 1000
    this._emitter?.update(dt*0.5)
    this._startTime = now
    this.id = requestAnimationFrame(this.update.bind(this))
  }

  start() {
    this._startTime = +new Date
    this.update()
  }

  stop() {
    cancelAnimationFrame(this.id!)
  }

  destroy() {
    this.stop()
    this.mesh.parent.remove(this.mesh)
  }

}

export default ParticleSystem
