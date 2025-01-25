# 快速开始

这个教程适用于 [ArenaPro](https://docs.box3lab.com/arenapro/) 插件用户。在 [这里](#) 不能访问到还未编写的适用于 Web 开发的文档。

## 概览

MineMotion 是一个轻量级的动画库，可以用于创造各种动画效果。

## 安装

### 前置条件

* ArenaPro 插件
* Node.js v22 或更高版本

### 使用 ArenaPro 插件安装

1. 在 VScode 编辑器界面按下 `Ctrl + Shift + P` 打开命令面板
2. 搜索 `ArenaPro` 并运行 `ArenaPro: 查看神岛NPM包` 命令
3. 在弹出的输入框中搜索 `minemotion` 并点击
4. 在左下角弹窗中点击“确认安装”，等待 `minemotion` 安装

### 使用 npm 安装

运行

```bash
npm install @dao3fun/mine-motion
```

## Hello World

这并非真的输出一个 `Hello, world`，而是 MineMotion 的一个最基本的示例。

在这个示例中，我们创建了一个正方形，并且在 1 秒内将正方形从 (0, 0) 移动到 (100, 100)。

```typescript
import { MineEases, MineMotion } from "@dao3fun/mine-motion";

// 创建 UiScreen
const defaultScreen = UiScreen.create();

// 创建容器并初始化
const box = UiBox.create();
box.backgroundColor.r = 200;
box.size.offset.x = 100;
box.size.offset.y = 100;
box.parent = defaultScreen;

// 应用动画
MineMotion.animate(box.position.offset, [
  {value: {x: 0, y: 0}, duration: 0},
  {value: {x: 100, y: 100}, duration: 1000, ease: MineEases.easeInOut}
], {
  delay: 0,
  speed: 1
})
```

那么这段代码中，我们究竟干了什么呢？

显然，最后四行代码是创建动画的关键。我们使用 `MineMotion.animate` 函数来创建动画，第一个参数是动画要改变的属性，第二个参数是动画的关键帧数据，第三个参数是动画配置。

我们为第二个参数传入了一个列表，其中每一项都是一个关键帧的数据：

- value 属性：表示关键帧的值。只有在这个属性中设置的值才会被应用到动画中。
- duration 属性：表示从上一个状态到当前帧的状态花费的时间。在上面的例子中，第一帧的 `duration` 是0，表示从初始状态到第一帧的状态花费的时间为0毫秒，也就是动画开始直接切换到位置为 (0, 0) 的状态；第二帧的 `duration` 是1000，表示从第一帧到第二帧的状态花费的时间为1000毫秒，也就是动画从位置为 (0, 0) 切换到位置为 (100, 100) 的状态需要1秒。
- ease 属性：表示动画的缓动函数，默认为线性。内置的缓动函数包括但不限于 `linear`, `sine`, `easeIn` 等，你也可以编写自己的缓动函数实现不同的动画效果。

在第三个参数中，我们传入了关于这个动画的一些配置，例如开始前延迟的时间，动画速度等。这个参数并非必须，也就是可以不传入第三个参数，默认的配置为 `{delay: 0, speed: 1}`。

你可以试试改变上面例子中的一些参数体会 MineMotion 的一些功能。

## Timeline

MineMotion 最核心的功能就在于 `Timeline`。使用 Timeline，你可以管理多个动画，并让它们协同工作。

以下是 Timeline 的一个简单示例：

```typescript
import { MineEases, MineTimeline } from "@dao3fun/mine-motion";

// 创建 UiScreen
const defaultScreen = UiScreen.create();

function createBox(x: number, y: number, color: Vec3) {
  const box = UiBox.create();
  box.size.offset.x = 100;
  box.size.offset.y = 100;
  box.position.offset.x = x;
  box.position.offset.y = y;
  box.backgroundColor.copy(color);
  box.parent = defaultScreen;
  return box;
}

const box1 = createBox(0, 0, Vec3.create({r: 222, g: 22, b: 22}));
const box2 = createBox(100, 0, Vec3.create({r: 22, g: 222, b: 22}));
const box3 = createBox(100, 100, Vec3.create({r: 22, g: 22, b: 222}));

const tl = new MineTimeline();
tl.animate(box1.position.offset, [
  {value: {x: 0, y: 0}, duration: 0},
  {value: {x: 100, y: 0}, duration: 1000, ease: MineEases.easeInOut},
  {value: {x: 100, y: 100}, duration: 1000, ease: MineEases.easeInOut},
  {value: {x: 0, y: 100}, duration: 1000, ease: MineEases.easeInOut},
  {value: {x: 0, y: 0}, duration: 1000, ease: MineEases.easeInOut}
], {
  offset: 0
});
tl.animate(box2.position.offset, [
  {value: {x: 100, y: 0}, duration: 0},
  {value: {x: 100, y: 100}, duration: 1000, ease: MineEases.easeInOut},
  {value: {x: 0, y: 100}, duration: 1000, ease: MineEases.easeInOut},
  {value: {x: 0, y: 0}, duration: 1000, ease: MineEases.easeInOut},
  {value: {x: 100, y: 0}, duration: 1000, ease: MineEases.easeInOut}
], {
  offset: 1000
});
tl.animate(box3.position.offset, [
  {value: {x: 100, y: 100}, duration: 0},
  {value: {x: 0, y: 100}, duration: 1000, ease: MineEases.easeInOut},
  {value: {x: 0, y: 0}, duration: 1000, ease: MineEases.easeInOut},
  {value: {x: 100, y: 0}, duration: 1000, ease: MineEases.easeInOut},
  {value: {x: 100, y: 100}, duration: 1000, ease: MineEases.easeInOut},
], {
  offset: 2000
});

tl.run();
```

尽管动画本身比较复杂，但是通过 Timeline，我们成功将三个动画组合在一起，并能轻松安排它们之间的时间关系。

在上面的例子中，我们首先创建了一个 `MineTimeline` 对象，并使用了三次 `tl.animate` 方法对于三个正方形分别编写了动画。 `tl.animate` 的调用方法和 `MineMotion.animate` 相差不大，只是多了个 `offset` 参数，这个参数表示动画在时间线上的开始时间，默认为 `0`。接着，我们使用了 `tl.run` 方法来启动动画。

另外，我们可以使用 `tl.seek` 方法来直接跳转到动画的某个时间点（不播放动画），改变 `tl.speed` 以改变动画的速度，以及 `tl.pause` 以停止动画。

## 数据驱动

请看如下的例子：

```typescript
import { MineTimeline } from "@dao3fun/mine-motion";

const tl = new MineTimeline();

tl.animate(box.size.offset, [
  {value: {x: 0}, duration: 0},
  {value: {x: 500}, duration: 100}
], {
  offset: 0
});
tl.animate(box.backgroundColor, [
  {value: {r: 255, g: 0, b: 0}, duration: 0},
  {value: {r: 255, g: 255, b: 0}, duration: 70},
  {value: {r: 0, g: 255, b: 0}, duration: 30}
], {
  offset: 0
});
tl.speed = 0.1;
tl.run();
```

在这个例子中，我们创建了一个逐渐变长，并且颜色逐渐从红色变为黄色，再变为绿色的长方形。

这个行为看上去似乎很像血量条？嗯，这的确是血量条的动画。然而，传统的动画中动画播放的时间是固定的，没有办法根据我们的血量数据动态改变动画的进度。

我们当然可以手动监听玩家的血量数据，并且根据这个数据配合 `tl.seek` 方法实现一个动态的血量条。但是这么做可能会带来很多维护上的麻烦。

幸运的是，在 Timeline 中，我们可以用非常容易的方式将上面的动画变成一个真的血量条。这就需要使用 Timeline 的**数据驱动**功能了。

Timeline 的数据驱动功能基于响应式实现，这就是说我们的数据必须是响应式的。我们可以使用 `ref` 函数创建一个响应式数据。

```typescript
const hp = ref(100);
```

此时 `hp` 是一个对象，有一个属性 `value`，这个属性就是我们的数据。在上面的例子中，`hp.value` 的值应该是 `100`。

接着我们需要更改 `tl` 的配置：

```typescript
const tl = new MineTimeline({
  driver: new MDataDriver(hp)
});
```

我们在创建 `MineTimeline` 时配置了 `driver` 属性，这个属性被设置为了一个 `MDataDriver` 对象，并且我们将 `hp` 用于初始化 `MDataDriver`。这样，当 `hp` 的值发生变化时，`MDataDriver` 会捕捉这个更新，并自动更新 `tl` 的进度。

以下是完整代码，你可以尝试运行看看效果。鼠标左键点击会减少血量，右键点击会增加血量。

::: code-group

```js [服务端代码]
world.onPlayerJoin(({entity}) => {
  entity.enableDamage = true;
  entity.showHealthBar = true;
  entity.hp = 100;
})

world.onPress(({entity, button}) => {
  if(button === GameButtonType.ACTION0){
    const d = Math.floor(Math.random()*30);
    console.log(`server hp -= ${d}`);
    entity.hp -= d;
  }
  if(button === GameButtonType.ACTION1){
    const d = Math.floor(Math.random()*30);
    console.log(`server hp += ${d}`);
    entity.hp += d;
  }
  remoteChannel.sendClientEvent(entity, {
    type: 'hp',
    value: entity.hp,
  })
})
```

```ts [客户端代码]
import { MDataDriver, MineTimeline, ref } from "@dao3fun/mine-motion";

const box = UiBox.create();
box.size.offset.x = 1000;
box.size.offset.y = 50;
box.backgroundColor.r = 255;
box.backgroundColor.g = 255;
box.backgroundColor.b = 255;
box.parent = ui;

const hp = ref(100);

remoteChannel.onClientEvent((event) => {
  if(event.type !== 'hp'){
    return;
  }
  hp.value = event.value;
})

const tl = new MineTimeline({
  driver: new MDataDriver(hp, {
    damping: {
      enabled: true,
      halflife: 500,
      deltaMs: 10
    }
  })
});

tl.animate(box.size.offset, [
  {value: {x: 0}, duration: 0},
  {value: {x: 500}, duration: 100}
], {
  offset: 0
});
tl.animate(box.backgroundColor, [
  {value: {r: 255, g: 0, b: 0}, duration: 0},
  {value: {r: 255, g: 255, b: 0}, duration: 70},
  {value: {r: 0, g: 255, b: 0}, duration: 30}
], {
  offset: 0
});
tl.run();
```
:::

关于 Timeline 的更多功能和详细解释，请查看 [API 文档](/api/overview)。