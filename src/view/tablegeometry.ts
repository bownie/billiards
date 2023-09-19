import { R } from "../model/physics/constants"

export class TableGeometry {
  static tableX: number
  static tableY: number
  static X: number
  static Y: number

  static {
    TableGeometry.scaleToRadius(R)
  }

  static scaleToRadius(R) {
    TableGeometry.tableX = R * (21.5 / 0.5)
    TableGeometry.tableY = R * (10.5 / 0.5)
    TableGeometry.X = TableGeometry.tableX + R
    TableGeometry.Y = TableGeometry.tableY + R
  }
}
