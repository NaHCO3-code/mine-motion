# 概览

在这篇文章中，你讲了解到 MineMotion 的内部运作原理，以便帮助你更好地看懂 API。

<style>
  h3:before {
    content: '';
    display: inline-block;
    width: 12px;
    height: 12px;
    margin-right: 5px;
    background-color: #3f6f9f;
    border-radius: 50%;
  }
</style>

## [Handler](/api/handler)&lt;T&gt;

MineHandler 是一个抽象类，同时也是 MineMotion 中描述一个动画最基本的单位。

通常，在使用 MineMotion 时你不会感觉到它的存在，因为其已经被 `MineTimeline` 等对象进行了很好的包装。在使用 `MineTimeline` 的一些方法（比如 `animate` 方法）时，会自动根据需要创建许多 `MineHandler` 对象。但是，如果你需要创建一些罕见的动画效果，你可能需要手动创建 `MineHandler` 对象，并且使用一些方法（例如 `MineTimeline.applyHandler`）让它们与正常的动画协同工作。


## [Plugin](/api/plugin)

有些动画效果比较通用，比如数字的线性插值，或者颜色值的线性插值。为了方便使用，MineMotion 提供了一个名为 `MinePlugin` 的抽象类，用于描述一些通用的动画效果。这些 `MinePlugin` 由 `MinePluginManager` 进行管理。

MineMotion 提供了一些基本的 `MinePlugin`，当前有 `MNumberPlugin` 用于数字的线性插值。



