import { CanNotAnimateErr, EaseFunc, MineAnimatable, MineEases } from "./Interfaces";
import { MineHandler } from "./MineHandler";
import { MinePluginManager } from "./MinePluginManager";
import { MotionDriver, MTimeDriverInstance } from "./MotionDriver";

export class MineTimeline {
  private handlers: {
    start: number,
    handler: MineHandler<any>
  }[] = [];

  now: number = 0;
  private _speed: number = 1;
  running: boolean = false;
  duration: number = 0;
  driver: MotionDriver;
  driverId: symbol | null = null;
  
  get speed(){
    return this._speed;
  }

  set speed(v: number){
    if(this.running) throw new Error('Can not set speed when timeline is running');
    this._speed = v;
  }

  constructor(config?: {
    driver?: MotionDriver
  }){
    this.driver = config?.driver ?? MTimeDriverInstance;
  }

  animate<T extends MineAnimatable>(
    object: T,
    keyframes: {value: Partial<T>, duraction?: number, ease?: EaseFunc}[],
    config: {
      offset: number,
    }
  ){
    let {offset = 0} = config;
    keyframes.forEach((keyframe, index, array) => {
      const {value, duraction = 1000, ease = MineEases.linear} = keyframe;
      if(array[index + 1] === void 0){
        return;
      }
      const tovalues = array[index + 1].value;
      for(const prop in value){
        if(tovalues[prop] === void 0) continue;
        const handler = MinePluginManager.getHandler<any>({
          getter(){
            return object[prop];
          },
          setter(v){
            object[prop] = v;
          },
          start: value[prop],
          end: tovalues[prop],
          duraction,
          ease
        });
        if(handler === CanNotAnimateErr){
          throw new Error(`Can not animate the property "${prop}". You may need extra plugins to make it work.`);
        }
        this.applyHandler(handler, offset);
      }
      offset += duraction;
    });
  }

  fromTo<T extends MineAnimatable, K extends keyof T>(
    obj: T,
    prop: K,
    conf: {
      start: T[K],
      end: T[K],
      duraction: number,
      ease?: EaseFunc
    },
    offset: number
  ){
    const {start, end, duraction, ease = MineEases.linear} = conf;
    const handler = MinePluginManager.getHandler<any>({
      getter(){
        return obj[prop];
      },
      setter(v){
        obj[prop] = v;
      },
      start,
      end,
      duraction,
      ease
    });
    if(handler === CanNotAnimateErr){
      throw new Error(`Can not animate the property "${String(prop)}". You may need extra plugins to make it work.`);
    }
    this.applyHandler(handler, offset);
  }

  to<T extends MineAnimatable, K extends keyof T>(
    obj: T,
    prop: K,
    conf: {
      end: T[K],
      duraction: number,
      ease?: EaseFunc
    },
    offset: number
  ){
    const {end, duraction, ease = MineEases.linear} = conf;
    const handler = MinePluginManager.getHandler<any>({
      getter(){
        return obj[prop];
      },
      setter(v){
        obj[prop] = v;
      },
      end,
      duraction,
      ease
    });
    if(handler === CanNotAnimateErr){
      throw new Error(`Can not animate the property "${String(prop)}". You may need extra plugins to make it work.`);
    }
    this.applyHandler(handler, offset);
  }

  /**
   * 在时间轴指定时间添加处理器。
   * @param handler 处理器
   * @param start 开始时间
   */
  applyHandler(handler: MineHandler<any>, start: number){
    if(this.running) throw new Error('Can not apply handler when timeline is running');
    this.duration = Math.max(this.duration, start + handler.duraction);
    this.handlers.push({start, handler});
  }

  /**
   * 更新时间轴。
   * @param deltaMs 与上一次更新间隔的时间
   */
  update(deltaMs: number){
    this.now += deltaMs;
    this.seek(this.now);
  }

  seek: (t: number) => void = this.seek_positive;

  /** 跳转到某一时间（速度为正） */
  seek_positive(t: number){
    this.now = t;
    const real = this.now * this._speed;
    for(const rec of this.handlers){
      if(real >= rec.start + rec.handler.duraction){
        rec.handler.seek(rec.handler.duraction);
        continue;
      }
      if(real < rec.start){
        continue;
      }
      rec.handler.seek(real - rec.start);
    }
  }

  /** 跳转到某一时间（速度为负） */
  seek_negative(t: number){
    this.now = t;
    const real = this.now * this._speed;
    for(const rec of this.handlers){
      console.log(real, rec);
      if(real <= rec.start){
        rec.handler.seek(0);
        continue;
      }
      if(real >= rec.start + rec.handler.duraction){
        continue;
      }
      rec.handler.seek(real - rec.start);
    }
  }

  /**
   * 运行时间轴。
   */
  run(){
    if(this.running) return;
    if(this._speed > 0){
      this.handlers.sort((a, b) => a.start + a.handler.duraction - b.start - b.handler.duraction);
      this.seek = this.seek_positive;
    }else{
      this.handlers.sort((a, b) => b.start - a.start);
      this.seek = this.seek_negative;
    }
    console.log(this.handlers);
    this.running = true;
    this.driverId = this.driver.drive(this);
  }

  /**
   * 暂停时间轴。
   */
  pause(){
    this.running = false;
    if(this.driverId) this.driver.remove(this.driverId);
  }
}