import { MNumberPlugin } from "./lib/BasePlugins/MNumberPlugin";
import { MinePluginManager } from "./lib/MinePluginManager";

MinePluginManager.register(new MNumberPlugin());

export {
  MineEases,
} from './lib/Interfaces'

export { MineTimeline } from './lib/MineTimeline'
export { MineTimeline_Experiment } from './lib/MineTimeline_Experiment'
export { MinePluginManager } from './lib/MinePluginManager'