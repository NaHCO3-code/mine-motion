# Hanlder

## MineHandler&lt;T&gt;

MineMotion 提供了一个 MineHandler 抽象类，是描述一个动画最基本的单位。

## 属性

### start: any

这个属性用于描述动画的起始值。

### end: any

这个属性用于描述动画的结束值。

### duration: number

这个属性用于描述动画的持续时间（以毫秒为单位）。

### setter: [Setter](/api/types.html#setter-lt-t-gt)&lt;T&gt;

这个属性是一个函数，用于设置动画的当前值。

## 方法

### seek(time: number): void

这个方法用于设置动画的当前时间。