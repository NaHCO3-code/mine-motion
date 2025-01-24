# 响应式

利用响应式，可以实现数据之间的绑定。

## ref&lt;T&gt;

ref 用于创建一个响应式对象。

参数

| 参数名 | 类型 | 描述 |
| --- | --- | --- |
| value | T | 响应式对象的初始值 |

返回值

| 返回值 | 类型 | 描述 |
| --- | --- | --- |
| ref | [Ref](#ref-lt-t-gt-1)&lt;T&gt; | 响应式对象 |

## watch&lt;T&gt;

watch 用于监听一个有响应式数据进行计算的值的变化，并在计算过程中涉及到任意一个响应式数据发生更改时调用回调函数。

参数

| 参数名 | 类型 | 描述 |
| --- | --- | --- |
| update | () => T | 有响应式数据参与计算的函数 |
| callback | (value: T) => void | 回调函数，用于处理响应式对象的变化 |

## computed&lt;T&gt;

computed 用于创建一个计算属性，该计算属性的值依赖于一个或多个响应式数据。

参数

| 参数名 | 类型 | 描述 |
| --- | --- | --- |
| update | () => T | 有响应式数据参与计算的函数 |

返回值

| 返回值 | 类型 | 描述 |
| --- | --- | --- |
| computed | [Computed](#computed-lt-t-gt-1)&lt;T&gt; | 计算属性 |

## Ref&lt;T&gt;

Ref 是一个对象，它具有一个 value 属性，用于获取或设置响应式对象的值。

| 属性名 | 类型 | 描述 |
| --- | --- | --- |
| value | T | 响应式对象的值 |

## Computed&lt;T&gt;

Computed 是一个对象，它具有一个 value 属性，用于获取计算属性的值。

| 属性名 | 类型 | 描述 |
| --- | --- | --- |
| value | T | 计算属性的值 |