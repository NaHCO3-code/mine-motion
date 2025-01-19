export type Getter<T> = () => T;
export type Setter<T> = (v: T) => void;
export type EaseFunc = (x: number) => number;
export type Result<Ok, Err> = Ok | Err;
/** @deprecated */
export type RecursivePartial<T> = {
  [K in keyof T]?: T[K] extends MineAnimatable
  ? RecursivePartial<T[K]> | undefined
  : T[K] | undefined
};
export type Currying<Fn> = Fn extends (arg: any) => any
  ? Fn
  : Fn extends (arg: infer T, ...args: infer U) => infer R
  ? (arg: T) => (...args: U) => R
  : never
;


export type CanNotAnimateErr = false;
export const CanNotAnimateErr = false;


export type MineAnimatable = { [K: string | number]: any };
export type MinePluse = {
  attach: (callback: (dt: number) => void) => symbol;
  seperate: (id: symbol) => void;
};
export const MineEases = {
  linear: (x: number) => x,
  sine: (x: number) => Math.sin(x * Math.PI / 2)
} as const;


export interface MineHandlerConfig<T> {
  getter: Getter<T>,
  setter: Setter<T>,
  start?: T;
  end: T;
  duraction: number;
  ease: EaseFunc;
}

export interface MineMotionConfig<T extends MineAnimatable> {
  obj: T;
  start: Partial<T>;
  end: Partial<T>;
  duraction: number;
  ease: EaseFunc;
}