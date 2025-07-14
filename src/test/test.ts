import { MNumberHandler, MNumberPlugin } from "../BasePlugins/MNumberPlugin";
import { Heap } from "../legacy/Heap";
import { MineEases } from "../Interfaces";
import { MineHandler } from "../MineHandler";
import { MineMotion_legacy } from "../legacy/MineMotion";
import { MineTimeline } from "../MineTimeline";
import { MineTimeline_Experiment } from "../legacy/MineTimeline_Experiment";
import { MinePluginManager } from "../MinePluginManager";
import { MDataDriver } from "../MDataDriver";
import { ref } from "../Reactive";
MinePluginManager.register(new MNumberPlugin());


// let a = 0;
// let b = 0;
// const tl = new MineTimeline_Experiment({});
// tl.applyHandler(new MNumberHandler({
//   getter: () => a,
//   setter: (v) => {a = v},
//   start: 0,
//   end: 1000,
//   duration: 1000,
//   ease: MineEases.linear
// }), 0)
// tl.applyHandler(new MNumberHandler({
//   getter: () => b,
//   setter: (v) => {b = v},
//   start: 0,
//   end: 1000,
//   duration: 500,
//   ease: MineEases.linear
// }), 500)
// tl.speed = -1;
// tl.seek(1000)
// tl.run();

// setInterval(() => {
//   console.log(a, b);
// }, 10);

let d = ref(0);
let c = {
  z: 100,
  // x: 0,
  // y: 0,
}
const tl = new MineTimeline({
  driver: new MDataDriver(d, {
    damping: {
      enabled: true,
      halflife: 1000,
      deltaMs: 10
    }
  })
});
tl.fromTo(c, 'z', {
  start: 0,
  end: 100,
  duration: 10000,
  ease: MineEases.linear,
  offset: 0
});
tl.speed = 1;
// tl.seek(0);
tl.run();

setInterval(() => {
  console.log(c);
}, 100);

setInterval(() => {
  d.value += 1000;
  console.log(`jmp ${d.value}`);
}, 500);