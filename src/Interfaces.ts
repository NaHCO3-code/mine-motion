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
  linear: (r: number) => r,
  sine: (r: number) => Math.sin(r*Math.PI/2),
  easeInOut: (r: number) => 6*r**5 - 15*r**4 + 10*r**3,
  easeIn: (r: number) => Math.sqrt(r),
  easeOut: (r: number) => r ** 3
} as const;


export interface MineHandlerConfig<T> {
  setter: Setter<T>,
  start: T;
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