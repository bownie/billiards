export const g = 9.8
export let mu = 0.29
export let muS = 0.89
export let muC = 0.2
export let rho = 0.4
export let m = 0.2
export let R = 0.5
export let e = 0.85
export let Mz: number
export let Mxy: number
export let I: number

refresh()

function refresh() {
  Mz = ((mu * m * g * 2) / 3) * rho
  Mxy = (7 / (5 * Math.sqrt(2))) * R * mu * m * g
  I = (2 / 5) * m * R * R
}

export function setR(val) {
  R = val
  refresh()
}
export function setm(val) {
  m = val
  refresh()
}
export function setmu(val) {
  mu = val
  refresh()
}
export function setrho(val) {
  rho = val
  refresh()
}
export function setmuS(val) {
  muS = val
}
export function sete(val) {
  e = val
}
export function setmuC(val) {
  muC = val
}
