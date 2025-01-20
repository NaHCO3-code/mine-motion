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
  running: boolean = false;
  duration: number = 0;
  driver: MotionDriver;
  driverId: symbol | null = null;
  autoStop: boolean = true;
  onFinish?: () => void;
  onStart?: () => void;
  private _speed: number = 1;
  
  get speed(){
    return this._speed;
  }

  set speed(v: number){
    if(this.running) throw new Error('Can not set speed when timeline is running');
    this._speed = v;
  }

  constructor(config?: {
    autoStop?: boolean,
    onFinish?: () => void,
    onStart?: () => void,
    driver?: MotionDriver
  }){
    this.autoStop = config?.autoStop ?? true;
    this.driver = config?.driver ?? MTimeDriverInstance;
    this.onFinish = config?.onFinish;
    this.onStart = config?.onStart;
  }

  /**
   * 为对象添加动画
   * @param obj 要附加动画的对象
   * @param keyframes 关键帧
   * @param config 配置
   */
  animate<T extends MineAnimatable>(
    obj: T,
    keyframes: {value: Partial<T>, duraction?: number, ease?: EaseFunc}[],
    config: {
      offset: number,
    }
  ){
    if(keyframes.length < 1){
      throw new Error('Can not animate an object without keyframes.');
    }
    let { offset = 0 } = config;
    let curv = keyframes[0].value;
    for(let prop in curv){
      curv[prop] = obj[prop];
    }
    for(let frame of keyframes){
      const {value, duraction = 1000, ease = MineEases.linear} = frame;
      for(let prop in value){
        this.fromTo(obj, prop, {
          start: curv[prop] ?? obj[prop],
          end: value[prop],
          duraction,
          ease,
          offset
        });
        curv[prop] = value[prop];
      }
    }
  }

  fromTo<T extends MineAnimatable, K extends keyof T>(
    obj: T,
    prop: K,
    config: {
      start: T[K],
      end: T[K],
      duraction: number,
      ease?: EaseFunc,
      offset?: number
    }
  ){
    const {start, end, duraction, ease = MineEases.linear, offset = 0} = config;
    const handler = MinePluginManager.getHandler<any>({
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
    config: {
      end: T[K],
      duraction: number,
      ease?: EaseFunc
      offset?: number
    },
  ){
    const {end, duraction, ease = MineEases.linear, offset = 0} = config;
    const handler = MinePluginManager.getHandler<any>({
      setter(v){
        obj[prop] = v;
      },
      start: obj[prop],
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
    if(this.autoStop && this.now >= this.duration){
      this.pause();
      this.onFinish?.();
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
    if(this.autoStop && this.now >= 0){
      this.pause();
      this.onFinish?.();
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
    this.running = true;
    this.driverId = this.driver.drive(this);
    
    const onFinish = this.onFinish;
    return new Promise<void>(resolve => {
      this.onStart?.();
      this.onFinish = () => {
        onFinish?.();
        resolve();
      }
    });
  }

  /**
   * 暂停时间轴。
   */
  pause(){
    this.running = false;
    if(this.driverId) this.driver.remove(this.driverId);
  }
}