# Plugin

## MinePlugin

`MinePlugin` 是一个可以通过一定的配置创建出一个 [MineHanlder](/api/handler) 的对象。通常被用于实现一些较为通用的动画效果。

### handle(config: [MineHandlerConfig](/api/types.html#minehandlerconfig-lt-t-gt)&lt;any&gt;): [MineHandler](/api/handler) | [CanNotAnimateErr](/api/types.html#cannotanimateerr)

尝试通过配置创建出一个 MineHandler。如果创建失败，则会返回 [CanNotAnimateErr](/api/types.html#cannotanimateerr)。

## MinePluginManager

`MinePluginManager` 是一个管理器，用于管理 [MinePlugin](/api/plugin#mineplugin)。

### register(plugin: [MinePlugin](/api/plugin#mineplugin))

注册一个 MinePlugin。

### getHandler(config: [MineHandlerConfig](/api/types.html#minehandlerconfig-lt-t-gt)&lt;any&gt;): [MineHandler](/api/handler) | [CanNotAnimateErr](/api/types.html#cannotanimateerr)

遍历注册的所有 `MinePlugin`，尝试通过配置创建出一个 MineHandler。如果创建失败，则会返回 [CanNotAnimateErr](/api/types.html#cannotanimateerr)。