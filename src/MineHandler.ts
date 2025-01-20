import { EaseFunc, MineHandlerConfig, Setter } from "./Interfaces";

/**
 * 处理动画的基类。
 */
export abstract class MineHandler<T> {
  setter: Setter<T>;
  start: T;
  end: T;
  duraction: number;
  ease: EaseFunc;
  
  constructor(config: MineHandlerConfig<T>){
    this.setter = config.setter;
    this.start = config.start;
    this.end = config.end;
    this.duraction = config.duraction;
    this.ease = config.ease;
  }

  /** 跳转到某一时间（相对于动画的起始时间） */
  abstract seek(t: number): void
}