import { MNumberPlugin } from "./lib/BasePlugins/MNumberPlugin";
import { MinePluginManager } from "./lib/MinePluginManager";

MinePluginManager.register(new MNumberPlugin());

export {
  MineEases,
  MineAnimatable,
  MDriverable,
} from './lib/Interfaces'

export { MineTimeline } from './lib/MineTimeline'
export { MineMotion } from './lib/MineMotion'
export { MineTimeline_Experiment } from './lib/MineTimeline_Experiment'
export { MinePluginManager } from './lib/MinePluginManager'