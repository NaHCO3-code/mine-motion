# Types and Constants

## Types

## MTimelineConfig

| 属性 | 类型 | 描述 |
| --- | --- | --- |
| autoStop? | boolean | 时间轴上所有动画都完成后是否自动停止时间轴 |
| onFinish? | () => void | 时间轴上所有动画都完成后的回调函数 |
| onStart? | () => void | 时间轴开始播放的回调函数 |
| driver? | MotionDriver | 时间轴的驱动器 |

## MKeyframe&lt;T extends MineAnimatable&gt;

| 属性 | 类型 | 描述 |
| --- | --- | --- |
| value | Partial&lt;T&gt; | 关键帧的数值 |
| duration? | number | 从上一帧的状态到该关键帧的持续时间，单位为毫秒 |
| easing? | EasingFunction | 关键帧的缓动函数 |

## MAnimationConfig

| 属性 | 类型 | 描述 |
| --- | --- | --- |
| offset | number | 关键帧相对动画开始的偏移量，单位为毫秒 |

## Constants

### MineEases

缓动函数的集合。

| 属性 | 备注 |
| --- | --- | 
| linear    | 线性缓动 |
| sine      | 正弦缓动 | 
| easeInOut | 缓入缓出 |
| easeIn    | 缓入 |
| easeOut   | 缓出 |
