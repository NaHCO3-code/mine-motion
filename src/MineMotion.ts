import { CanNotAnimateErr, EaseFunc, MineAnimatable, MineEases } from "./Interfaces";
import { MinePluginManager } from "./MinePluginManager";
import { MineTimeline } from "./MineTimeline";
import { MDefaultDriver } from "./MTimeDriver";

export abstract class MineMotion {
  /**
   * 针对某个属性添加动画。
   * @param obj 目标对象
   * @param prop 目标属性
   * @param config 动画配置
   */
  static async fromTo<T extends MineAnimatable, K extends keyof T>(
    obj: T,
    prop: K,
    config: {
      start: T[K],
      end: T[K],
      duration: number,
      ease?: EaseFunc
      speed?: number
    }
  ) {
    const tl = new MineTimeline();
    tl.fromTo(obj, prop, {
      start: config.start,
      end: config.end,
      duration: config.duration,
      ease: config.ease ?? MineEases.linear,
      offset: 0
    });
    tl.speed = config.speed ?? 1;
    await tl.run();
  }

  /**
   * 针对某个属性添加动画。
   * @param obj 目标对象
   * @param prop 目标属性
   * @param config 动画配置
   */
  static async to<T extends MineAnimatable, K extends keyof T>(
    obj: T,
    prop: K,
    config: {
      end: T[K],
      duration: number,
      ease?: EaseFunc
      speed?: number
    },
  ) {
    const tl = new MineTimeline();
    tl.to(obj, prop, {
      end: config.end,
      duration: config.duration,
      ease: config.ease ?? MineEases.linear,
      offset: 0
    });
    tl.speed = config.speed ?? 1;
    await tl.run();
  }

  /**
   * 为对象添加动画
   * @param obj 要附加动画的对象
   * @param keyframes 关键帧
   * @param config 配置
   */
  static async animate<T extends MineAnimatable>(
    obj: T,
    keyframes: {value: Partial<T>, duration?: number, ease?: EaseFunc}[],
    config?: {
      delay?: number,
      speed?: number
    }
  ) {
    const tl = new MineTimeline();
    tl.animate(obj, keyframes, {
      offset: config?.delay ?? 0,
    });
    tl.speed = config?.speed ?? 1;
    await tl.run();
  }
}