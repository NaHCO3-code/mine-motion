import { MNumberPlugin } from "./BasePlugins/MNumberPlugin";
import { CanNotAnimateErr, MineHandlerConfig, Result } from "./Interfaces";
import { MineHandler } from "./MineHandler";
import { MinePlugin } from "./MinePlugin";


/**
 * 插件管理器，用于管理所有插件。
 */
export abstract class MinePluginManager {
  /** @description 所有插件 */
  private static plugins: MinePlugin<any>[] = [];

  /**
   * 将插件注册到插件列表，以便使用。
   * @param plugin 要注册的插件
   */
  static register(plugin: MinePlugin<any>){
    MinePluginManager.plugins.push(plugin);
    MinePluginManager.plugins.sort((a, b) => b.weight - a.weight);
  }
  
  /**
   * 依次尝试所有插件，尝试获得 handler。
   * @param config 配置
   * @returns 如果能处理，返回对应 handler，否则返回 CanNotAnimateErr
   */
  static getHandler<T>(config: MineHandlerConfig<T>)
    :Result<MineHandler<T>, CanNotAnimateErr> 
  {
    for(const plugin of MinePluginManager.plugins){
      const handler = plugin.handle(config);
      if(handler !== CanNotAnimateErr){
        return handler;
      }
    }
    return CanNotAnimateErr;
  }
}
