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

  destroy(){
    clearInterval(this.intervalId);
    this.motions = [];
  }

  drive(motion: MDriveable): symbol {
    const id = Symbol();
    this.motions.push({
      motion,
      id
    });
    return id;
  }

  remove(motion: symbol): void {
    const index = this.motions.findIndex(m => m.id === motion);
    if(index === -1) return;
    this.motions.splice(index, 1);
  }
}

export const MDefaultDriver = new MTimeDriver();