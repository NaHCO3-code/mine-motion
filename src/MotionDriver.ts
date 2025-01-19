type MDriverable = {
  update(dt: number): void,
  seek(time: number): void
}

export interface MotionDriver {
  drive(motion: MDriverable): symbol
  remove(motion: symbol): void
  destroy(): void
}

export class MTimeDriver implements MotionDriver {
  private motions: {
    motion: MDriverable,
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

  drive(motion: MDriverable): symbol {
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

export const MTimeDriverInstance = new MTimeDriver();