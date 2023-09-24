import { Ball } from "../model/ball"
import { TableGeometry } from "../view/tablegeometry"
import { Vector3 } from "three"
import { round, roundVec } from "./utils"
import { R } from "../model/physics/constants"

export class Rack {
  static readonly noise = (R * 0.05) / 0.5
  static readonly gap = 2 * R + 2 * Rack.noise
  static readonly up = new Vector3(0, 0, -1)

  private static jitter(pos) {
    return roundVec(
      pos
        .clone()
        .add(
          new Vector3(
            Rack.noise * (Math.random() - 0.5),
            Rack.noise * (Math.random() - 0.5),
            0
          )
        )
    )
  }

  static readonly spot = new Vector3(-TableGeometry.X / 2, 0.0, 0)

  static cueBall(pos) {
    return new Ball(pos, 0xfaebd7)
  }

  static diamond() {
    const across = new Vector3(0, Rack.gap, 0)
    const diagonal = across.clone().applyAxisAngle(Rack.up, (Math.PI * 1) / 3)
    const pos = new Vector3(TableGeometry.tableX / 2, 0, 0)
    const diamond: Ball[] = []
    diamond.push(Rack.cueBall(Rack.spot))
    diamond.push(new Ball(Rack.jitter(pos), 0xe0de36))
    pos.add(diagonal)
    diamond.push(new Ball(Rack.jitter(pos), 0xff9d00))
    pos.sub(across)
    diamond.push(new Ball(Rack.jitter(pos), 0x521911))
    pos.add(diagonal)
    diamond.push(new Ball(Rack.jitter(pos), 0x595200))
    pos.sub(across)
    diamond.push(new Ball(Rack.jitter(pos), 0xff0000))
    pos.addScaledVector(across, 2)
    diamond.push(new Ball(Rack.jitter(pos), 0x050505))
    pos.add(diagonal).sub(across)
    diamond.push(new Ball(Rack.jitter(pos), 0x0a74c2))
    pos.sub(across)
    diamond.push(new Ball(Rack.jitter(pos), 0x087300))
    pos.add(diagonal)
    diamond.push(new Ball(Rack.jitter(pos), 0x3e009c))
    return diamond
  }

  static three() {
    const threeballs: Ball[] = []
    const dx = round(TableGeometry.X / 2)
    const dy = round(TableGeometry.Y / 4)
    threeballs.push(Rack.cueBall(new Vector3(-dx, -dy, 0)))
    threeballs.push(new Ball(new Vector3(-dx, 0, 0), 0xe0de36))
    threeballs.push(new Ball(new Vector3(dx, 0, 0), 0xff0000))
    return threeballs
  }
}
