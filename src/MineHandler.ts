import { Ease, Getter, MineEases, MineHandlerConfig, Setter } from "./Interfaces";

/**
 * 插值器
 */
export abstract class MineHandler<T> {
  getter: Getter<T>;
  setter: Setter<T>;
  start: T;
  end: T;
  duraction: number;
  ease: Ease;
  
  constructor(config: MineHandlerConfig<T>){
    this.getter = config.getter;
    this.setter = config.setter;
    this.start = config.start ?? this.getter();
    this.end = config.end;
    this.duraction = config.duraction;
    this.ease = config.ease;
  }

  abstract seek(t: number): void
}