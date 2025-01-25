# Types and Constants

## Types

### Setter&lt;T&gt;

一个函数，用于设置动画的属性。

```typescript
type Setter<T> = (v: T) => void;
```

### EaseFunc

缓动函数。一般定义域为 [0, 1] ，值域为 [0, 1] 。

```typescript
type EaseFunc = (x: number) => number;
```

### CanNotAnimateErr

无法创建动画时返回，值为 `false`。

### MineHandlerConfig&lt;T&gt;

MinePlugin 的 `handle` 方法所需的配置对象。

| 属性 | 类型 | 描述 |
| --- | --- | --- |
| setter | [Setter](/api/types.html#setter-lt-t-gt)&lt;T&gt; | 设置动画的属性的函数 |
| start | T | 动画开始时的值 |
| end | T | 动画结束时的值 |
| duration | number | 动画持续时间，单位为毫秒 |
| ease | [EaseFunc](/api/types.html#easefunc) | 动画缓动函数 |

### MTimelineConfig

| 属性 | 类型 | 描述 |
| --- | --- | --- |
| autoStop? | boolean | 时间轴上所有动画都完成后是否自动停止时间轴 |
| onFinish? | () => void | 时间轴上所有动画都完成后的回调函数 |
| onStart? | () => void | 时间轴开始播放的回调函数 |
| driver? | MotionDriver | 时间轴的驱动器 |

### MKeyframe&lt;T extends MineAnimatable&gt;

| 属性 | 类型 | 描述 |
| --- | --- | --- |
| value | Partial&lt;T&gt; | 关键帧的数值 |
| duration? | number | 从上一帧的状态到该关键帧的持续时间，单位为毫秒 |
| easing? | [EaseFunc](/api/types.html#easefunc) | 关键帧的缓动函数 |

### MAnimationConfig

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
