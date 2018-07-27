//import Sprite from '../base/sprite'

const screenWidth = window.innerWidth
const screenHeight = window.innerHeight

let BG = new Image()
let PALADIN = new Image()
let SWORDMAN = new Image()
BG.src= 'images/panel.png'
PALADIN.src = 'images/ic_paladin.png'
SWORDMAN.src = 'images/ic_swordman.png'
const BG_WIDTH = 5
const BG_HEIGHT = 16
const PALADIN_WIDTH = 60
const PALADIN_HEIGHT = 80
const SWORDMAN_WIDTH = 36
const SWORDMAN_HEIGHT = 48
/**
 * 游戏背景类
 * 提供update和render函数实现无限滚动的背景功能
 */
export default class Settings {
  // constructor(ctx) {
  //   super(BG_IMG_SRC, BG_WIDTH, BG_HEIGHT)

  //   this.render(ctx)

  //   this.top = 0
  // }


  /**
   * 背景图重绘函数
   * 绘制两张图片，两张图片大小和屏幕一致
   * 第一张漏出高度为top部分，其余的隐藏在屏幕上面
   * 第二张补全除了top高度之外的部分，其余的隐藏在屏幕下面
   */
  render(ctx) {
    ctx.drawImage(
      BG,
      0,
      0,
      BG_WIDTH,
      BG_HEIGHT,
      10,
      40,
      BG_WIDTH*13*1.5,//100
      BG_HEIGHT*1.5   //65
    )


    ctx.drawImage(
      PALADIN,
      0,
      0,
      PALADIN_WIDTH,
      PALADIN_HEIGHT,
      10,
      30 - PALADIN_HEIGHT/3,
      PALADIN_WIDTH / 2 * 1.5,
      PALADIN_HEIGHT / 2 * 1.5
    )

    ctx.drawImage(
      SWORDMAN,
      0,
      0,
      SWORDMAN_WIDTH,
      SWORDMAN_HEIGHT,
      10 + PALADIN_WIDTH / 1.5 * 1.5,
      15,
      SWORDMAN_WIDTH / 1.5 * 1.5,
      SWORDMAN_HEIGHT / 1.5 * 1.5
    )

  }
}
