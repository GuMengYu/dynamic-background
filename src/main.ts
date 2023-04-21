import './style.css'
import { Vhs } from './vhs'
const canvas = document.createElement('canvas')
canvas.setAttribute('id', 'vhs-canvas')
canvas.style.height = '100vh'
canvas.style.width = '100vw'
canvas.style.position = 'fixed'
canvas.style.top = '0'
canvas.style.left = '0'

document.getElementById('app')?.append(canvas)

const vhs = new Vhs(canvas, {width: window.innerWidth, height: window.innerHeight, res: 12, brightness: 1, animate: true})


setTimeout(() => {
  vhs.update([0xff7200, 0x0064ff, 0x8b00ff])
}, 5000)
