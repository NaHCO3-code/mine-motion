import { EaseFunc, MineHandlerConfig, Setter } from "./Interfaces";

/**
 * 描述动画的基本单位。
 */
export abstract class MineHandler<T> {
  setter: Setter<T>;
  start: any;
  end: any;
  duration: number;
  ease: EaseFunc;
  
  constructor(config: MineHandlerConfig<T>){
    this.setter = config.setter;
    this.start = config.start;
    this.end = config.end;
    this.duration = config.duration;
    this.ease = config.ease;
  }

  /** 跳转到某一时间（相对于动画的起始时间） */
  abstract seek(t: number): void
}