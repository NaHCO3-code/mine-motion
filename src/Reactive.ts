type Effect = () => any;
type Key = any;

let activeEffect: Effect | null = null;

let targetMap = new WeakMap<Object, Map<Key, Set<Effect>>>();

function track(obj: Object, key: string){
  if(!activeEffect) return;
  let depsMap = targetMap.get(obj);
  if(!depsMap){
    depsMap = new Map();
    targetMap.set(obj, depsMap);
  }
  let dep = depsMap.get(key);
  if(!dep){
    dep = new Set();
    depsMap.set(key, dep);
  }
  dep.add(activeEffect);
}

function trigger(obj: Object, key: string){
  const depsMap = targetMap.get(obj);
  if(!depsMap) return;
  const dep = depsMap.get(key);
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
      track(this, 'value');
      return value;
    },
    set value(v: T){
      if(v === value) return;
      value = v;
      trigger(this, 'value');
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

export function computed<T>(update: () => T extends void ? never : T){
  let value: T;
  const effect = () =>{
    activeEffect = effect;
    value = update();
    activeEffect = null;
  };
  effect();
  return {
    get value(){
      track(this, 'value');
      return value;
    }
  }
}