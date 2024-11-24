import { Ease, MineAnimatable, MineMotionConfig } from "./Interfaces";
import { Mine } from "./Mine";

/**
 * T 代表被应用动画的对象，
 * U 代表被应用动画的属性。
 * setStart 和 setEnd 的复杂类型是为了让使用者获得更好的报错信息和编辑器智能提示。
 * 
 * 关于这两个函数类型的解释如下：
 * - 当 MineMotion.animate 被调用时，返回了一个 LazyMotionSetter 对象，此时 U 是 
 * never。
 * - 如果 setStart 先被调用，此时参数的类型为 T extends P ? P : T。
 *     + 如果传入的参数合法（即参数中所有的属性都在 T 中），该参数的类型会被推断为 P 
 *       并返回 LazyMotionSetter<T, P>
 *     + 如果传入的参数不合法（当且仅当 start 中存在一个属性，这个属性在 T 上不存在）
 *       那么该参数的类型会被推断为 T，此时 tsc 的报错信息会精确指出这个错误属性。
 * - 然后，setEnd 被调用，此时 U 为调用 setStart 时传入的参数的类型，因此参数的类型
 *   为 U，即调用 setStart 时传入的参数的类型。
 * 
 * setStart 与 setEnd 具有对偶性，因此如果 setEnd 先被调用，将会在 setStart
 * 上产生相同的效果。
 * 
 * 这样就可以保证，传入的 start/end 中的所有属性一定在传入的对象上，并且 start 中的
 * 所有属性都在 end 中，end 中的所有属性都在 start 中，并且当传入的参数错误时，将会
 * 给出更好的报错提示，以及编译器将会给出更加精确的智能推断。
 */
export interface LazyMotionSetter<
  T extends MineAnimatable, 
  U extends Partial<T> | null
> {
  start: Partial<T> | null;
  end: Partial<T> | null;
  duraction: number | null;
  ease: Ease | null;
  setStart<P extends Partial<T>>
    (start: U extends null ? T extends P ? P : T : U)
    :LazyMotionSetter<T, U extends null ? P : U>
  setEnd<P extends Partial<T>>
    (end: U extends null ? T extends P ? P : T : U)
    :LazyMotionSetter<T, U extends null ? P : U>
  setDuraction(duraction: number): LazyMotionSetter<T, U>
  setEase(ease: Ease): LazyMotionSetter<T, U>
  getMotion(): Mine<U extends null ? never : U>
}

export abstract class MineMotion{
  static animate<T extends MineAnimatable>
    (obj: T): LazyMotionSetter<T, null>{
    /**
     * 为了给调用者提供更好的报错信息，不得不使用一些黑魔法。绝大多数情况下,
     * 这些操作的类型都是可以保证的，只是无法通过 ts 的类型系统精确描述。
     * 例如，根据 setStart 函数的参数 start 的类型描述，看上去这个函数的
     * 返回值可能是 LazyMotionSetter<T>，但是当 T extends P 不成立时，
     * 代码无法通过编译，并且调用者会收到更好的报错信息。使用 Extract<T, P>
     * 也可以达到相似效果，但是如果传入错误的参数，该参数类型会被推断为
     * null，报错信息不友好。
     * @todo 需要检查内存泄漏的可能性。
     */
    return {
      start: null,
      end: null,
      duraction: null,
      ease: null,
      // @ts-ignore
      setStart(start) {
        this.start = start;
        return this;
      },
      // @ts-ignore
      setEnd(end){
        this.end = end;
        return this;
      },
      setDuraction(duraction){
        this.duraction = duraction;
        return this;
      },
      setEase(ease){
        this.ease = ease;
        return this;
      },
      getMotion(){
        if(this.start === null){
          throw new Error(`Properity start is required. Did you forget calling setStart()?`);
        }
        if(this.end === null){
          throw new Error(`Properity end is required. Did you forget calling setEnd()?`);
        }
        if(this.duraction === null){
          throw new Error(`Properity duraction is required. Did you forget calling setDuraction()?`);
        }
        if(this.ease === null){
          throw new Error(`Properity ease is required. Did you forget calling setEase()?`);
        }
        return new Mine({
          obj, 
          start: this.start, 
          end: this.end, 
          duraction: this.duraction,
          ease: this.ease
        })
      }
    }
  }
}