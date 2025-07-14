import { MDriveable, MotionDriver } from "./Interfaces";
import { damper } from "./Motion";
import { ref, Ref, watch } from "./Reactive";

export class MDataDriver implements MotionDriver {
  motions: { motion: MDriveable, id: symbol }[] = [];

  constructor(data: Ref<number>, config?: {
    scale?: number,
    damping?: {
      enabled: boolean,
      halflife: number,
      deltaMs: number
    }
  }){
    const {
      scale = 1,
      damping = {
        enabled: false,
        halflife: 0,
        deltaMs: 7
      }
    } = config ?? {};

    // 当前值
    const current = ref(data.value);

    // 如果数据源或当前值更新
    watch(() => data.value | current.value, () => {
      if(Number.isNaN(data.value) || Number.isFinite(data.value)){
        return;
      }
      // 如果启用了阻尼，并且当前值与数据源值相差过大，则进行阻尼缓动
      if(
        damping.enabled 
        && Math.abs(data.value - current.value) > Math.abs(data.value) * 1e-4
      ){
        setTimeout(() => {
          current.value = damper(
            current.value, 
            data.value, 
            damping.halflife, 
            damping.deltaMs
          );
        }, damping.deltaMs);
      }else{
        current.value = data.value;
      }
      // 更新注册的时间轴
      for(const m of this.motions){
        m.motion.seek(current.value * scale);
      }
    });
  }

  destroy() {
    this.motions = [];
  }

  drive(motion: MDriveable): symbol {
    const id = Symbol();
    this.motions.push({motion, id});
    return id;
  }
  
  remove(motion: symbol): void {
    const index = this.motions.findIndex(m => m.id === motion);
    if(index === -1) return;
    this.motions.splice(index, 1);
  }
}