import "mocha"
import { expect } from "chai"
import { AimInputs } from "../../src/view/aiminputs"
import { initDom, canvas3d } from "./dom"
import { Container } from "../../src/container/container"

initDom()

describe("AimInput", () => {
  let container: Container
  let aiminputs: AimInputs

  beforeEach(function (done) {
    container = new Container(canvas3d, (_) => {})
    aiminputs = new AimInputs(container)
    done()
  })

  it("adjust spin", (done) => {
    const e = { buttons: 1, offsetX: 1, offsetY: 1 }
    aiminputs.mousemove(e)
    expect(aiminputs.cueHitElement).to.be.not.null
    done()
  })

  it("click hit button", (done) => {
    document.getElementById("cueHit")?.click()
    expect(aiminputs.container.inputQueue).to.be.not.empty
    done()
  })

  it("mouse wheel updates power", (done) => {
    aiminputs.mousewheel({ deltaY: 10 })
    expect(aiminputs.container.table.cue.aim.power).to.be.closeTo(1, 0.1)
    done()
  })
})
