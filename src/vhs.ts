import { Graphics, Container, Application, Ticker } from 'pixi.js';
import { KawaseBlurFilter } from "@pixi/filter-kawase-blur";
import { createNoise3D } from "simplex-noise";
const noise3D = createNoise3D()

interface VhsOptions {
  width?: number
  height?: number
  res?: number
  brightness?: number
  animate?: boolean
  colors?: [number, number, number]
  baseColor?: number
}
export class Vhs {
  app: Application
  containers: Container[] = []
  graphices: Graphics[] = []
  fills: Graphics[] = []

  width: number
  height: number
  res: number
  rows: number
  cols: number
  inc = 0.02
  cutoff = -0.125
  zOff = 0
  ticker?: Ticker

  constructor(el: HTMLCanvasElement, option: VhsOptions) {
    const { width = 700, height = 700, res = 15, brightness = 0.5, animate = false, colors = [0x4597d4, 0xf1a63f, 0xea345d], baseColor = 0xffffff } = option ?? {}
    el.style.filter = `brightness(${brightness})`
    this.res = res
    this.cols = 1 + width / res;
    this.rows = 1 + height / res;
    this.width = width
    this.height = height
    this.app = new Application({
      view: el,
      width: width,
      height: height,
      resolution: 1,
      autoDensity: false,
      backgroundColor: baseColor
    })
    const blurFilter = new KawaseBlurFilter(20, 10, true);
    this.app.stage.filters = [blurFilter];

    colors.forEach((color) => {
      const graphics = new Graphics()

      this.app.stage.addChild(graphics)
      this.graphices.push(graphics)

      const container = new Container()
      this.app.stage.addChild(container)
      container.mask = graphics
      this.containers.push(container)

      const fill = new Graphics();
      container.addChild(fill);
      fill.beginFill(color);
      fill.drawRect(0, 0, width, height);
      fill.alpha = 1
      this.fills.push(fill)
    })

    if (width < 700) {
      this.cutoff = -0.125
    }

    this.render()
    if (animate) {
      this.ticker = this.app.ticker.add(() => {
        this.render()
      })
    }
  }
  destory() {
    this.ticker?.destroy()
    this.app.destroy()
  }
  render() {

    this.graphices.forEach((graphics, idx) => {
      let xOff = idx * 1000

      graphics.clear()
      graphics.beginFill(0x000000)

      for (let i = 0; i < this.cols; i++) {
        xOff += this.inc;

        let yOff = idx * 1000;
     
        for (let j = 0; j < this.rows; j++) {
          const noise = noise3D(xOff, yOff, this.zOff);

          if (noise > this.cutoff) {
            graphics.drawRect(i * this.res, j * this.res, this.res, this.res);
          }
          yOff += this.inc;
        }
      }
      graphics.endFill()
    })
  
    this.zOff += 0.005;
  

  }
  update(colors: [number, number, number], baseColor?: number) {
    this.zOff = 0
    if (baseColor) {
      // ts will throw error but it work
      (this.app.renderer as any).backgroundColor = baseColor
    }
    this.fills.forEach((fill, idx) => {
      fill.clear()
      fill.beginFill(colors[idx])
      fill.drawRect(0, 0, this.width, this.height)
    })

  }
}