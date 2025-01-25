import { MDriveable, MotionDriver } from "./Interfaces";


export class MTimeDriver implements MotionDriver {
  private motions: {
    motion: MDriveable,
    id: symbol
  }[] = [];

  intervalId: number = -1;

  constructor(){
    this.intervalId = setInterval(() => {
      for(const m of this.motions){
        m.motion.update(7);
      }
    }, 7);
  }

  /**
   * 销毁驱动器
   */
  destroy(){
    clearInterval(this.intervalId);
    this.motions = [];
  }

  /**
   * 注册可以被驱动的对象
   * @param motion 运动
   * @returns id
   */
  drive(motion: MDriveable): symbol {
    const id = Symbol();
    this.motions.push({
      motion,
      id
    });
    return id;
  }

  /**
   * 移除一个运动
   * @param motion id
   * @returns 
   */
  remove(motion: symbol) {
    const index = this.motions.findIndex(m => m.id === motion);
    if(index === -1) return;
    this.motions.splice(index, 1);
  }
}

export const MDefaultDriver = new MTimeDriver();