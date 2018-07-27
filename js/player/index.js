import Sprite from '../base/sprite'
import Bullet from './bullet'
import DataBus from '../databus'

const screenWidth = window.innerWidth
const screenHeight = window.innerHeight

// 玩家相关常量设置

const PLAYER_IMG_SRC = 'images/Paladin.png'
const PLAYER_WIDTH = 92
const PLAYER_HEIGHT = 98
const ATLAS_MAXFRAMEWIDTH = 92
const ATLAS_MAXFRAMEHEIGHT = 98

let databus = new DataBus()

export default class Player extends Sprite {
  constructor() {
    super(PLAYER_IMG_SRC, PLAYER_WIDTH, PLAYER_HEIGHT)

    // 玩家默认处于屏幕底部居中位置
    this.x = screenWidth / 2 - this.width / 2-100
    this.y = screenHeight / 2 - this.height +50

    // 用于在手指移动的时候标识手指是否已经在飞机上了
    this.touched = false

    this.bullets = []

    this.speed = 3
    this.startX = 0
    this.startY = 0
    this.disX = 0
    this.disY = 0
    this.stepnum = 0
    this.direction = 3

    // 初始化事件监听
    this.initEvent()
  }

  setPosition(x, y) {
    //disX,Y是图像顶点最终目标坐标
    //startX,Y是图像顶点初始坐标
    if (this.touched) {
      //let disX = x - this.width / 2
      //let disY = y - this.height / 2
      let absdistanceX = Math.abs(this.disX - this.startX)
      let absdistanceY = Math.abs(this.disY - this.startY)
      let distance = Math.sqrt(absdistanceX * absdistanceX + absdistanceY * absdistanceY)
      let steps = distance / this.speed
      let curX=this.x
      let curY = this.y

      //console.log(this.isInArea(this.x, this. y))
      //console.log(this.x)
      

      if (this.disX < 0)
        this.disX = 0

      else if (this.disX > screenWidth - this.width)
        this.disX = screenWidth - this.width

      if (this.disY <= 0)
        this.disY = 0

      else if (this.disY > screenHeight - this.height)
        this.disY = screenHeight - this.height


      if (steps == 0) {
        return
      } else {
        this.x += (this.disX - this.startX) / steps
        this.y += (this.disY - this.startY) / steps
        this.stepnum++
        if(!this.isInArea(curX, curY - 5)) {
          this.touched = false
          this.stepnum = 0
          //this.x += 5
          this.y += 5
          return
        }
        else if (!this.isInArea(curX-5, curY+5)) {
          this.touched = false
          this.stepnum = 0
          this.x += 5
          this.y -= 5
          return
        }
        else if (!this.isInArea(curX + 5, curY - 5)) {
          this.touched = false
          this.stepnum = 0
          this.x -= 5
          this.y += 5
          return
        }
          if (this.stepnum > steps) {
            this.touched = false
            this.stepnum = 0
          }
      }
    } else {
      return
    }
  }

  // /**
  //  * 玩家响应手指的触摸事件
  //  * 改变战机的位置
  //  */
  initEvent() {
    canvas.addEventListener('touchstart', ((e) => {
      e.preventDefault()


      let x = e.touches[0].clientX
      let y = e.touches[0].clientY
      
      if (x < 110 && y < 75) {
        return
      } else {
        this.startX = this.x
        this.startY = this.y
        this.disX = e.touches[0].clientX - this.width / 2
        this.disY = e.touches[0].clientY - this.height / 2
        if (Math.abs(this.disX - this.startX) < 10 && Math.abs(this.disY - this.startY) < 10) {
          return
        } else {
          this.stepnum = 0
          this.direction = this.getDirection(this.startX, this.startY, this.disX, this.disY)

          this.touched = true

          this.setPosition(x, y)
        }
      }
      //}

    }).bind(this))
  }

  //   canvas.addEventListener('touchmove', ((e) => {
  //     e.preventDefault()

  //     let x = e.touches[0].clientX
  //     let y = e.touches[0].clientY

  //     if ( this.touched )
  //       this.setPosition(x, y)

  //   }).bind(this))

  //   canvas.addEventListener('touchend', ((e) => {
  //     e.preventDefault()

  //     this.touched = false
  //   }).bind(this))
  // }


  drawToCanvas(ctx) {
    ctx.drawImage(
      this.img,
      ATLAS_MAXFRAMEWIDTH * 0,
      ATLAS_MAXFRAMEHEIGHT * this.direction,
      ATLAS_MAXFRAMEWIDTH, //IMPROVE
      ATLAS_MAXFRAMEHEIGHT,
      this.x,
      this.y,
      this.width,
      this.height

    )
  }

  //calculate the direction(0:North,.. 7:N-W) when moving from start to end. 
  getDirection(startX, startY, endX, endY) {
    let xDelta = (endX - startX);
    let yDelta = (endY - startY);
    let tan = (yDelta == 0) ? -1 : Math.abs(yDelta / xDelta); //PI/2:0, 0:-1
    let TAN_1 = 0.41421356; //Math.tan(Math.PI / 8);
    let TAN_2 = 2.41421356; //Math.tan(Math.PI*3 / 8);
    //alert(TAN_1 + "," + TAN_2);
    let radian = 0; //0:0, 1:PI/4, 2:PI/2
    if (tan == 0 || tan > TAN_2)
      radian = 2;
    else if (tan > TAN_1 && tan < TAN_2)
      radian = 1;
    else
      radian = 0;

    if (xDelta > 0 && yDelta > 0) {
      return (radian == 0) ? 2 : ((radian == 1) ? 3 : 4);
    } else if (xDelta < 0 && yDelta > 0) {
      return (radian == 0) ? 6 : ((radian == 1) ? 5 : 4);
    } else if (xDelta < 0 && yDelta < 0) {
      return (radian == 0) ? 6 : ((radian == 1) ? 7 : 0);
    } else if (xDelta > 0 && yDelta < 0) {
      return (radian == 0) ? 2 : ((radian == 1) ? 1 : 0);
    }
  }

  //IMPROVE 有效区域判断
  isInArea(testx, testy) {
    // let vertx = [0,180,730,730,370,300,0]
    // let verty = [110,110,320,400,400,250,240]
    let vertx = [0,140,680,680,320,250,0]
    let verty = [40,40,240,320,320,200,190]
    let i = 0
    // for(i=0;i<7;i++){
    //   vertx[i]-=50
    //   verty[i]-=80
    // }
    let nvert = 7
    if (testx < 0 || testx > 680 || testy < 40 || testy > 320) {
      return false
    }

    //let i = 0
    let j = 0
    let c = false
    for (i = 0, j = nvert - 1; i < nvert; j = i++) {
      if (((verty[i] > testy) != (verty[j] > testy)) &&
        (testx < (vertx[j] - vertx[i]) * (testy - verty[i]) / (verty[j] - verty[i]) + vertx[i]))
        c = !c;
    }
    return c;
  }
}