import { MNumberHandler } from "../BasePlugins/MNumberPlugin";
import { Heap } from "../Heap";
import { MineEases } from "../Interfaces";
import { MineHandler } from "../MineHandler";
import { MineMotion } from "../MineMotion";
import { MineTimeline } from "../MineTimeline";

// const tl = new MineTimeline({
  
// });

// let o = {
//   a: 1,
//   b: "2"
// }

// MineMotion.animate(o)
//   .setStart({a: 0})
//   .setEnd({a: 1})
//   .setDuraction(1000)
//   .setEase(MineEases.sine)
//   .getMotion();

let a = 0;
let b = 0;
const tl = new MineTimeline({});
tl.applyHandler(new MNumberHandler({
  getter: () => a,
  setter: (v) => {a = v},
  start: 0,
  end: 1000,
  duraction: 1000,
  ease: MineEases.linear
}), 0)
tl.applyHandler(new MNumberHandler({
  getter: () => b,
  setter: (v) => {b = v},
  start: 0,
  end: 1000,
  duraction: 500,
  ease: MineEases.linear
}), 500)
tl.speed = -1;
tl.seek(1000)
tl.run();

setInterval(() => {
  console.log(a, b);
}, 10);