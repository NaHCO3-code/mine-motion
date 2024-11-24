import { CanNotAnimateErr, MineHandlerConfig, Result } from "./Interfaces";
import { MineHandler } from "./MineHandler";

/**
 * 插件，用于处理不同类型数值的动画
 */
export abstract class MinePlugin<T> {
  /**@description 插件的优先级。数值越高越先被匹配。 */
  weight: number = 1

  /**
   * 尝试通过该插件得到对应的 handler 。
   * 如果该插件不能处理这类数据，返回 CanNotAnimateErr。
   * @param config 配置
   */
  abstract handle(config: MineHandlerConfig<any>)
    :Result<MineHandler<T>, CanNotAnimateErr>
}