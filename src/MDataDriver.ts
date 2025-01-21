import { MDriveable, MotionDriver } from "./Interfaces";

export class MDataDriver implements MotionDriver {
  motions: {motion: MDriveable, id: symbol}[] = [];
  constructor(){
  }
  destroy() {
    this.motions = [];
  }
  drive(motion: MDriveable): symbol {
    const id = Symbol();
    this.motions.push({motion, id});
    return id;
  }
  remove(motion: symbol): void{}
}