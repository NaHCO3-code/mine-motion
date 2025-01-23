import { CanNotAnimateErr, EaseFunc, MineAnimatable, MineEases } from "./Interfaces";
import { MinePluginManager } from "./MinePluginManager";
import { MineTimeline } from "./MineTimeline";
import { MDefaultDriver } from "./MTimeDriver";

export abstract class MineMotion {
  static async fromTo<T extends MineAnimatable, K extends keyof T>(
    obj: T,
    prop: K,
    config: {
      start: T[K],
      end: T[K],
      duraction: number,
      ease?: EaseFunc
      speed?: number
    }
  ) {
    const tl = new MineTimeline();
    tl.fromTo(obj, prop, {
      start: config.start,
      end: config.end,
      duraction: config.duraction,
      ease: config.ease ?? MineEases.linear,
      offset: 0
    });
    tl.speed = config.speed ?? 1;
    await tl.run();
  }

  static async to<T extends MineAnimatable, K extends keyof T>(
    obj: T,
    prop: K,
    config: {
      end: T[K],
      duraction: number,
      ease?: EaseFunc
      speed?: number
    },
  ) {
    const tl = new MineTimeline();
    tl.to(obj, prop, {
      end: config.end,
      duraction: config.duraction,
      ease: config.ease ?? MineEases.linear,
      offset: 0
    });
    tl.speed = config.speed ?? 1;
    await tl.run();
  }

  static async animate<T extends MineAnimatable>(
    obj: T,
    keyframes: {value: Partial<T>, duraction?: number, ease?: EaseFunc}[],
    config: {
      delay?: number,
      speed?: number
    }
  ) {
    const tl = new MineTimeline();
    tl.animate(obj, keyframes, {
      offset: config.delay ?? 0,
    });
    tl.speed = config.speed ?? 1;
    await tl.run();
  }
}