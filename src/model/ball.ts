import { Vector3 } from "three"
import { zero, vec, passesThroughZero, up } from "../utils/utils"
import {
  sliding,
  surfaceVelocity,
  rollingFull,
  forceRoll,
} from "../model/physics/physics"
import { BallMesh } from "../view/ballmesh"
import { g } from "./physics/constants"
import { Pocket } from "./physics/pocket"

export enum State {
  Stationary = "Stationary",
  Rolling = "Rolling",
  Sliding = "Sliding",
  Falling = "Falling",
  InPocket = "InPocket",
}

export class Ball {
  pos: Vector3
  vel: Vector3 = zero.clone()
  rvel: Vector3 = zero.clone()
  state: State = State.Stationary
  pocket: Pocket
  futurePos: Vector3 = zero.clone()

  ballmesh: BallMesh

  readonly transition = 0.05

  constructor(pos, color?) {
    this.pos = pos.clone()
    this.ballmesh = new BallMesh(color ? color : 0x555555 * Math.random())
  }

  update(t) {
    this.updatePosition(t)
    this.updateVelocity(t)
    if (this.state == State.Falling) {
      this.updateFalling(t)
    }
  }

  updateMesh(t) {
    this.ballmesh.updatePosition(this.pos)
    if (this.rvel.lengthSq() != 0) {
      this.ballmesh.updateRotation(this.rvel, t)
    }
  }

  private updatePosition(t: number) {
    this.pos.addScaledVector(this.vel, t)
  }

  private updateFalling(t: number) {
    this.vel.addScaledVector(up, -10 * t * g)
    if (this.pos.z < -2) {
      this.setStationary()
      this.state = State.InPocket
    }

    if (this.pos.distanceTo(this.pocket.pos) > this.pocket.radius - 0.5) {
      const toCentre = this.pocket.pos
        .clone()
        .sub(this.pos)
        .normalize()
        .multiplyScalar(this.vel.length() * 0.5)
      if (this.vel.dot(toCentre) < 0) {
        this.vel.x = toCentre.x
        this.vel.y = toCentre.y
      }
    }
  }

  private updateVelocity(t: number) {
    if (this.inMotion()) {
      if (this.isRolling()) {
        this.updateVelocityRolling(t)
      } else {
        this.updateVelocitySliding(t)
      }
    }
  }

  private updateVelocityRolling(t) {
    forceRoll(this.vel, this.rvel)
    let dv = new Vector3()
    let dw = new Vector3()
    rollingFull(this.rvel, dv, dw)
    dv.multiplyScalar(t)
    dw.multiplyScalar(t)
    if (passesThroughZero(this.rvel, dw) || passesThroughZero(this.vel, dv)) {
      this.setStationary()
    } else {
      this.vel.add(dv)
      this.rvel.add(dw)
      this.state = State.Rolling
    }
  }

  private updateVelocitySliding(t) {
    let dv = new Vector3()
    let dw = new Vector3()
    sliding(this.vel, this.rvel, dv, dw)
    dv.multiplyScalar(t)
    dw.multiplyScalar(t)
    if (passesThroughZero(this.rvel, dw) && passesThroughZero(this.vel, dv)) {
      this.setStationary()
    } else {
      this.vel.add(dv)
      this.rvel.add(dw)
      this.state = State.Sliding
    }
  }

  private setStationary() {
    this.vel.copy(zero)
    this.rvel.copy(zero)
    this.state = State.Stationary
  }

  isRolling() {
    return (
      this.vel.lengthSq() != 0 &&
      surfaceVelocity(this.vel, this.rvel).length() < this.transition
    )
  }

  onTable() {
    return this.state !== State.Falling && this.state !== State.InPocket
  }

  inMotion() {
    return this.state == State.Rolling || this.state == State.Sliding
  }

  futurePosition(t) {
    this.futurePos.copy(this.pos).addScaledVector(this.vel, t)
    return this.futurePos
  }

  serialise() {
    return { pos: this.pos, vel: this.vel, rvel: this.rvel, state: this.state }
  }

  static fromSerialised(data) {
    return Ball.updateFromSerialised(new Ball(vec(data.pos)), data)
  }

  static updateFromSerialised(b, data) {
    b.pos.copy(data.pos)
    b.vel.copy(vec(data.vel))
    b.rvel.copy(vec(data.rvel))
    b.state = data.state
    return b
  }
}
