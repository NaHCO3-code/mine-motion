# 基于数据的动画驱动器

## class MDataDriver

### constructor

参数

| 参数名 | 类型 | 描述 |
| --- | --- | --- |
| data | [Ref](/api/reactive.html#ref-lt-t-gt-1)&lt;number&gt; | 数据源 |
| config? | [MDataDriverConfig](#mdatadriverconfig) | 配置 |


## Types

### MDataDriverConfig

| 属性 | 类型 | 描述 |
| --- | --- | --- |
| scale? | number | 数据源到时间的缩放倍数 |
| damping? | [MDataDriverDampingConfig](#mdatadriverdampingconfig) | 阻尼配置 |

### MDataDriverDampingConfig

| 属性 | 类型 | 描述 |
| --- | --- | --- |
| enabled | boolean | 是否启用阻尼 |
| halflife | number | 阻尼系数 |
| deltaMs | number | 更新间隔 |