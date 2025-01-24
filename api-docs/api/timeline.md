# Timeline API

Timeline API 可以帮助创建更强大的动画。

## class MineTimeline

### constructor

参数

| 参数名 | 类型 | 描述 |
| --- | --- | --- |
| config? | [MTimelineConfig](/api/types/#mtimelineconfig) | 配置对象 |

默认值

| 属性 | 默认值 | 备注 |
| --- | --- | --- |
| autoStop | true / false | `driver` 为 `MDataDriver` 时，默认为 `true`，否则为 `false` |
| onFinish | undefined | 默认不使用 |
| onStart | undefined | 默认不使用 |
| driver | MDefaultDriver | 默认为基于时间的驱动器 |

## Methods

### animate&lt;T extends MineAnimatable&gt;

基于关键帧创建动画。

参数

| 参数名 | 类型 | 描述 |
| --- | --- | --- |
| obj | T | 动画对象 |
| keyframes | [MKeyframe](/api/types/#mkeyframe-lt-t-extends-mineanimatable-gt)&lt;T&gt;[] | 关键帧数组 |
| config | [MAnimationConfig](/api/types/#manimationconfig) | 配置对象 |

默认值

| 属性 | 默认值 | 备注 |
| --- | --- | --- |
| keyframes.duration | 1000 | - |
| keyframes.easing | MineEases.linear | 线性缓动 |

### seek

直接跳转到时间轴指定时间。

参数

| 参数名 | 类型 | 描述 |
| --- | --- | --- |
| time | number | 时间 |

### run

运行动画。

参数

| 参数名 | 类型 | 描述 |
| --- | --- | --- |
| reset | boolean | 是否重置时间到起点 |

### pause

暂停动画。

## Properties

### speed

播放速度，默认为 1。