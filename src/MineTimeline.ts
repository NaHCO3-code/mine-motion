import { CanNotAnimateErr, EaseFunc, MineAnimatable, MineEases, MotionDriver } from "./Interfaces";
import { MDataDriver } from "./MDataDriver";
import { MineHandler } from "./MineHandler";
import { MinePluginManager } from "./MinePluginManager";
import { MDefaultDriver } from "./MTimeDriver";

export class MineTimeline {
  private handlers: {
    start: number,
    handler: MineHandler<any>
  }[] = [];

  private _now: number = 0;
  private _running: boolean = false;
  private _duration: number = 0;
  private driver: MotionDriver;
  private driverId: symbol | null = null;
  readonly autoStop: boolean = true;
  private resolve?: (() => void) | null;
  private _speed: number = 1;
  /** 当时间轴停止时调用，如果 autoStop 为 true，则不起效。 */
  onFinish: (() => void) | null;
  /** 当时间轴开始时调用，如果 autoStop 为 true，则不起效。 */
  onStart: (() => void) | null;
  
  get speed(){
    return this._speed;
  }

  set speed(v: number){
    if(this._running) throw new Error('Can not set speed when timeline is running');
    this._speed = v;
  }

  get now(){
    return this._now;
  }

  get duration(){
    return this._duration;
  }

  get running(){
    return this._running;
  }

  /**
   * 创建一个 Timeline
   * @param config Timeline 配置
   */
  constructor(config?: {
    autoStop?: boolean,
    onFinish?: () => void,
    onStart?: () => void,
    driver?: MotionDriver
  }){
    this.driver = config?.driver ?? MDefaultDriver;
    this.autoStop = config?.autoStop ?? (this.driver instanceof MDataDriver ? false : true);
    this.onFinish = config?.onFinish ?? null;
    this.onStart = config?.onFinish ?? null;
  }

  /**
   * 为对象添加动画
   * @param obj 要附加动画的对象
   * @param keyframes 关键帧
   * @param config 配置
   */
  animate<T extends MineAnimatable>(
    obj: T,
    keyframes: {value: Partial<T>, duration?: number, ease?: EaseFunc}[],
    config: {
      offset: number,
    }
  ){
    if(keyframes.length < 1){
      throw new Error('Can not animate an object without keyframes.');
    }
    let { offset = 0 } = config;
    let curv = {...keyframes[0].value};
    for(let prop in curv){
      curv[prop] = obj[prop];
    }
    for(let frame of keyframes){
      const {value, duration = 1000, ease = MineEases.linear} = frame;
      for(let prop in value){
        this.fromTo(obj, prop, {
          start: curv[prop] ?? obj[prop],
          end: value[prop],
          duration,
          ease,
          offset
        });
        curv[prop] = value[prop];
      }
      offset += duration;
    }
  }

  /**
   * 针对某个属性添加动画。
   * @param obj 目标对象
   * @param prop 目标属性
   * @param config 动画配置
   */
  fromTo<T extends MineAnimatable, K extends keyof T>(
    obj: T,
    prop: K,
    config: {
      start: T[K],
      end: T[K],
      duration: number,
      ease?: EaseFunc,
      offset?: number
    }
  ){
    const {start, end, duration, ease = MineEases.linear, offset = 0} = config;
    const handler = MinePluginManager.getHandler<any>({
      setter(v){
        obj[prop] = v;
      },
      start,
      end,
      duration,
      ease
    });
    if(handler === CanNotAnimateErr){
      throw new Error(`Can not animate the property "${String(prop)}".
You may need extra plugins to make it work.`);
    }
    this.applyHandler(handler, offset);
  }

  /**
   * 针对某个属性添加动画。
   * @param obj 目标对象
   * @param prop 目标属性
   * @param config 动画配置
   */
  to<T extends MineAnimatable, K extends keyof T>(
    obj: T,
    prop: K,
    config: {
      end: T[K],
      duration: number,
      ease?: EaseFunc
      offset?: number
    },
  ){
    const {end, duration, ease = MineEases.linear, offset = 0} = config;
    const handler = MinePluginManager.getHandler<any>({
      setter(v){
        obj[prop] = v;
      },
      start: obj[prop],
      end,
      duration,
      ease
    });
    if(handler === CanNotAnimateErr){
      throw new Error(`Can not animate the property "${String(prop)}". 
You may need extra plugins to make it work.`);
    }
    this.applyHandler(handler, offset);
  }

  /**
   * 在时间轴指定时间添加处理器。
   * @param handler 处理器
   * @param start 开始时间
   */
  applyHandler(handler: MineHandler<any>, start: number){
    if(this._running) throw new Error('Can not apply handler when timeline is running');
    // 避免零时长
    if(handler.duration === 0) handler.duration += 1e-5;
    this._duration = Math.max(this._duration, start + handler.duration);
    this.handlers.push({start, handler});
  }

  /**
   * 更新时间轴。
   * @param deltaMs 与上一次更新间隔的时间
   */
  update(deltaMs: number){
    this._now += deltaMs;
    this.seek(this._now);
  }

  /**
   * 跳转到某一时间。
   * @param t 时间
   */
  seek: (t: number) => void = this.seek_positive;

  /** 跳转到某一时间（速度为正） */
  private seek_positive(t: number){
    this._now = t;
    const real = this._now * this._speed;
    for(const rec of this.handlers){
      if(real >= rec.start + rec.handler.duration){
        rec.handler.seek(rec.handler.duration);
        continue;
      }
      if(real < rec.start){
        continue;
      }
      rec.handler.seek(real - rec.start);
    }
    if(this.autoStop && real >= this._duration){
      this.pause();
      this.onFinish?.();
      this.resolve?.();
      this.resolve = null;
    }
  }

  /** 跳转到某一时间（速度为负） */
  private seek_negative(t: number){
    this._now = t;
    const real = this._now * this._speed;
    for(const rec of this.handlers){
      console.log(real, rec);
      if(real <= rec.start){
        rec.handler.seek(0);
        continue;
      }
      if(real >= rec.start + rec.handler.duration){
        continue;
      }
      rec.handler.seek(real - rec.start);
    }
    if(this.autoStop && this._now >= 0){
      this.pause();
      this.onFinish?.();
      this.resolve?.();
      this.resolve = null;
    }
  }

  /**
   * 运行时间轴。
   */
  run(reset: boolean = true){
    if(this._running) return;
    if(this._speed > 0){
      this.handlers.sort((a, b) => a.start + a.handler.duration - b.start - b.handler.duration);
      this.seek = this.seek_positive;
    }else{
      this.handlers.sort((a, b) => b.start - a.start);
      this.seek = this.seek_negative;
    }
    if(reset){
      this.seek(this._speed > 0 ? 0 : -this._duration);
    }
    this._running = true;
    this.driverId = this.driver.drive(this);

    const onFinish = this.onFinish;
    return new Promise<void>(resolve => {
      this.onStart?.();
      this.resolve = resolve;
    });
  }

  /**
   * 暂停时间轴。
   */
  pause(){
    this._running = false;
    if(this.driverId) this.driver.remove(this.driverId);
  }
}