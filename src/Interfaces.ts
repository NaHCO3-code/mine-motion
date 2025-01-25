/** 用于获取值 */
export type Getter<T> = () => T;

/** 用于设置值 */
export type Setter<T> = (v: T) => void;

/** 过渡函数，一般定义域为[0, 1]，值域为[0, 1] */
export type EaseFunc = (x: number) => number;

/** 返回结果，成功 Ok，失败 Err */
export type Result<Ok, Err> = Ok | Err;

/** 柯里化 */
export type Currying<Fn> = Fn extends (arg: any) => any
  ? Fn
  : Fn extends (arg: infer T, ...args: infer U) => infer R
  ? (arg: T) => (...args: U) => R
  : never
;

/** Plugin 无法处理该动画时返回 */
export type CanNotAnimateErr = false;
export const CanNotAnimateErr = false;

/** 可以应用动画的对象 */
export type MineAnimatable = { [K: string | number]: any };

/** 可以运行动画的对象 */
export type MDriveable = {
  /**
   * 根据时间增量更新当前值
   * @param dt 时间增量
   */
  update(dt: number): void,

  /**
   * 根据相对时间更新当前值
   * @param time 时间
   */
  seek(time: number): void
};

/** 动画驱动器 */
export interface MotionDriver {
  /**
   * 驱动可被驱动的对象
   * @param motion 需要驱动的对象
   * @returns 用于移除该驱动的标识符
   */
  drive(motion: MDriveable): symbol;

  /**
   * 移除可被驱动的对象
   * @param motion 需要移除的对象
   */
  remove(motion: symbol): void;

  /**
   * 销毁驱动器
   */
  destroy(): void;
}

/** @deprecated 仅用于 MineTimeline_Experiment，未来会被移除 */
export type MinePluse = {
  attach: (callback: (dt: number) => void) => symbol;
  seperate: (id: symbol) => void;
};

/** 常用过渡动画 */
export const MineEases = {
  linear: (r: number) => r,
  sine: (r: number) => Math.sin(r*Math.PI/2),
  easeInOut: (r: number) => 6*r**5 - 15*r**4 + 10*r**3,
  easeIn: (r: number) => Math.sqrt(r),
  easeOut: (r: number) => r ** 3
} as const;

/** 处理器配置 */
export interface MineHandlerConfig<T> {
  setter: Setter<T>;
  start: T;
  end: T;
  duration: number;
  ease: EaseFunc;
}

/** 动画配置 */
export interface MineMotionConfig<T extends MineAnimatable> {
  obj: T;
  start: Partial<T>;
  end: Partial<T>;
  duration: number;
  ease: EaseFunc;
}