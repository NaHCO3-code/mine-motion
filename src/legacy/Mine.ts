import { CanNotAnimateErr, EaseFunc, MineAnimatable, MineMotionConfig } from "../Interfaces";
import { MineHandler } from "../MineHandler";
import { MinePluginManager } from "../MinePluginManager";

/**
 * 插值器的管理器。
 * @deprecated
 */
export class Mine_legacy<T extends MineAnimatable>{
  handlers: MineHandler<any>[] = [];
  now: number;

  constructor(config: MineMotionConfig<T>){
    for(let prop in config.start){
      if(config.end[prop] === void 0) continue;
      if(config.obj[prop] === void 0) continue;
      let handler = MinePluginManager.getHandler<any>({
        // getter(){
        //   return config.obj[prop]
        // },
        setter(v){
          config.obj[prop] = v;
        },
        start: config.start[prop],
        end: config.end[prop],
        duraction: config.duraction,
        ease: config.ease
      });
      if(handler === CanNotAnimateErr){
        throw new Error(`Can not animate the property "${prop}". You may need extra plugins to make it work.`);
      }
      this.handlers.push(handler);
    }
    this.now = 0;
  }

  seek(time: number){
    this.now = time;
    for(let handler of this.handlers){
      handler.seek(this.now);
    }
  }

  update(dt: number){
    this.now += dt;
    this.seek(this.now);
  }
}