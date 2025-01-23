import { MNumberPlugin } from "./lib/BasePlugins/MNumberPlugin";
import { MinePluginManager } from "./lib/MinePluginManager";

MinePluginManager.register(new MNumberPlugin());

export {
  MineEases,
  MineAnimatable,
  MDriveable,
} from './lib/Interfaces'

export { MineTimeline } from './lib/MineTimeline'
export { MineMotion } from './lib/MineMotion'
export { MineTimeline_Experiment } from './lib/MineTimeline_Experiment'
export { MinePluginManager } from './lib/MinePluginManager'
export { ref, watch, computed, Ref, Computed} from './lib/Reactive'
export { lerp, damper } from './lib/Motion'
export { MDataDriver } from './lib/MDataDriver'