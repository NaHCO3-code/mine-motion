type Effect = () => any;
type Key = any;

let activeEffect: Effect | null = null;

let depsMap = new WeakMap<Object, Set<Effect>>();

function track(obj: Object){
  if(!activeEffect) return;
  let dep = depsMap.get(obj);
  if(!dep){
    dep = new Set();
    depsMap.set(obj, dep);
  }
  dep.add(activeEffect);
}

function trigger(obj: Object){
  const dep = depsMap.get(obj);
  if(!dep) return;
  dep.forEach(effect => effect());
}

export type Ref<T> = {
  value: T;
}

export type Computed<T> = {
  readonly value: T;
}

export function ref<T>(value: T){
  return {
    get value(){
      track(this);
      return value;
    },
    set value(v: T){
      if(v === value) return;
      value = v;
      trigger(this);
    }
  }
}

export function watch<T>(update: () => T, callback: ((value: T) => void) | (() => void)){
  const effect = () =>{
    activeEffect = effect;
    const res = update();
    callback(res);
    activeEffect = null;
  };
  effect();
}

export function computed<T>(update: () => T extends void ? never : T): Computed<T>{
  let value: T;
  const effect = () =>{
    activeEffect = effect;
    value = update();
    activeEffect = null;
  };
  effect();
  return {
    get value(){
      track(this);
      return value;
    }
  }
}