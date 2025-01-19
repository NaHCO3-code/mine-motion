import { Heap } from "./Heap";
import { MinePluse } from "./Interfaces";
import { MineHandler } from "./MineHandler";

type handlerRec = {start: number, end: number, handler: MineHandler<any>};

/**
 * 带有堆优化的时间轴。
 * 在处理极端大量的 handler 时，性能可能会更好。
 * 实验性功能，不建议在生产环境中使用。
 */
export class MineTimeline_Experiment {
  pluseSource: MinePluse;
  handlers: handlerRec[] = [];
  duraction: number = 0;
  now: number = 0;
  private _speed: number = 1;
  private _pluseId: symbol | null = null;
  private _running: boolean = false;
  private _pendingHandlers: Heap<handlerRec> = new Heap((a, b) => a.start < b.start);
  private _runningHandlers: Heap<handlerRec> = new Heap((a, b) => a.end < b.end);
  
  constructor(config: {pluseSource?: MinePluse}){
    this.pluseSource = config.pluseSource ?? MineTimeline_Experiment.defaultPluseSource;
  }

  /**
   * 添加一个 handler 到时间轴。
   * @param handler handler
   * @param start 开始时间
   */
  applyHandler(handler: MineHandler<any>, start: number){
    if(this._running){
      throw new Error("Can not apply handlers while animation running.");
    }
    this.handlers.push({start, end: start + handler.duraction, handler: handler});
    this.duraction = Math.max(this.duraction, start + handler.duraction);
  }

  /**
   * 启动时间轴。
   */
  run(){
    this._running = true;
    this._runningHandlers.clear();
    this._pendingHandlers.clear();
    // 如果动画进行的方向不同，更新的逻辑会有区别。
    if(this._speed >= 0){
      this._pluseId = this.pluseSource.attach((dt) => this.update_forward(dt));
      this._pendingHandlers.cmp = (a, b) => a.start < b.start;
      this._runningHandlers.cmp = (a, b) => a.end < b.end;
    }else{
      this._pluseId = this.pluseSource.attach((dt) => this.update_backward(dt));
      this._pendingHandlers.cmp = (a, b) => a.end > b.end;
      this._runningHandlers.cmp = (a, b) => a.start > b.start;
    }
    for(const rec of this.handlers){
      this._pendingHandlers.insert(rec);
    }
  }

  /**
   * 停止时间轴。
   */
  stop(){
    this.pause();
    this._running = false;
  }

  set speed(v: number){
    if(this._running){
      throw new Error("Can not change speed while timeline is running.");
    }
    this._speed = v;
  }

  get speed(){
    return this._speed;
  }

  /**
   * 更新时间轴（速度为正）。
   */
  private update_forward(dt: number){
    this.now += dt*this._speed;
    let top = this._pendingHandlers.top;
    // 取出 pendingHandlers 中已经开始的 handler 加入 runningHandlers
    while(top !== null && top.start <= this.now){
      this._runningHandlers.insert(top);
      this._pendingHandlers.pop();
      top = this._pendingHandlers.top;
    }
    top = this._runningHandlers.top;
    // 扔掉所有 runningHandlers 中已经结束的 handler
    while(top !== null && top.end <= this.now){
      top.handler.seek(top.handler.duraction);
      this._runningHandlers.pop();
      top = this._pendingHandlers.top;
    }
    for(const {start, handler} of this._runningHandlers.nodes){
      handler.seek(this.now - start);
    }
  }

  /**
   * 更新时间轴（速度为负）
   */
  private update_backward(dt: number){
    this.now += dt*this._speed;
    let top = this._pendingHandlers.top;
    // 取出 pendingHandlers 中已经开始的 handler 加入 runningHandlers
    while(top !== null && top.end >= this.now){
      this._runningHandlers.insert(top);
      this._pendingHandlers.pop();
      top = this._pendingHandlers.top;
    }
    top = this._runningHandlers.top;
    // 扔掉所有 runningHandlers 中已经结束的 handler
    while(top !== null && top.start >= this.now){
      top.handler.seek(0);
      this._runningHandlers.pop();
      top = this._pendingHandlers.top;
    }
    for(const {start, handler} of this._runningHandlers.nodes){
      handler.seek(this.now - start);
    }    
  }

  /**
   * 跳转到某个时间节点。
   * @param time 时间（毫秒）
   */
  seek(time: number){
    if(this._running){
      throw new Error("Can not seek while timeline is running.");
    }
    this.now = time;
  }

  /**
   * 暂停时间轴。请注意这并不会使时间轴处于停止状态，
   * 暂停期间不能向时间轴添加动画。
   */
  pause(){
    if(this._pluseId === null) return;
    this.pluseSource.seperate(this._pluseId);
    this._pluseId = null;
  }

  /**
   * 恢复处于暂停状态的时间轴。
   */
  resume(){
    if(!this._running){
      throw new Error("Can not resume a timeline before start it. Call start() instead.")
    }
    this._pluseId = this.pluseSource.attach((dt) => this.update_forward(dt));
  }

  private static drawCallbacks: Map<symbol, (dt: number) => void> = new Map();
  private static intervalId: number | null = null;
  static enableInnerInterval(){
    if(this.intervalId !== null) return;
    let t = Date.now();
    this.intervalId = setInterval(() => {
      let tn = Date.now();
      let dt = tn - t;
      t = tn;
      this.drawCallbacks.forEach(fn => fn(dt));
    }, 1);
  }
  static disableInnerInterval(){
    if(this.intervalId === null) return;
    clearInterval(this.intervalId);
    this.intervalId = null;
  }
  static defaultPluseSource = {
    attach: (callback: (dt: number) => void) => {
      const sym = Symbol();
      this.drawCallbacks.set(sym, callback);
      return sym;
    },
    seperate: (id: symbol) => {
      this.drawCallbacks.delete(id);
    }
  }
}

MineTimeline_Experiment.enableInnerInterval();