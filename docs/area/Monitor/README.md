# 前端监控

## 监控方法论
`Metrics`、`Tracing`、`Logging`
- `Metrics`监控的基础，指标是一段时间内累计的计数或度量
- `Tracing`面向的是请求，可以分析出请求及链路中异常点
- `Logging`展现的是应用运行而产生的事件，可以详细解释系统的运行状态

## 前端监控内容
页面加载时：
1. 页面加载数据
2. 资源加载数据
3. 接口请求数据

页面运行时：
1. 用户行为数据
2. 运行环境数据
3. 程序异常数据
4. 接口请求数据
5. 自定义数据

## 前端监控架构
数据采集阶段：
- 性能数据（如地图fps)
- 异常数据
- 行为数据等等

:::tip
**行为数据**
- 页面跳转：哈希路由，监听`hash change`；非哈希路由`patch pushState/replaceState`
- 元素曝光：`getBoundingClientRect()`/`IntersectionObserver`
- 元素点击：`window.addEventListener('click', (e) => {})

**异常数据**
- 运行时异常：
1. `window.onerror = function(message,source,lineno,colno,error){...}`
2. `window.addEventListener('unhandlerejection', function(event){...})`
3. `script`设置`crossorigin="anonymous"` 响应头 `Access-Control-Allow-Origin: *`
4. 前端框架封装，`Vue errorHandler`

- 资源加载异常：
1. `window.addEventListener('error', function(event){...}, true)`
2. 过滤运行时异常，避免重复上报

**接口数据/基础数据**
- 接口数据：
1. `patch fetch/XMLHttpRequest`
2. 获取`http error`与`network fail`
3. 提供`hook`业务逻辑异常
4. 获取接口调用耗化

- 基础数据：
1. `User-Agent`
2. `IP`
3. `patch console.log`

**性能数据**
- 页面加载性能
1. `NavigationTiming`
2. 区间耗时
3. 加载瀑布图

- 资源加载性能
1. `ResourceTiming`
2. 全量资源请求数据

- 页面运行性能
1. 帧率
2. `Long Task Observer`

- 以用户为中心的指标
1. 首次渲染FP/首次内容渲染FCP
2. 首次有意义渲染FMP
3. 可交互时间TTI
4. 长任务统计 Long Task
:::

数据处理阶段：
- 数据接入
- 实时处理
- 数据服务
- 离线处理

数据应用阶段：
- 监控告警
- 可视化分析

## 异常分析与监控
异常监控：
- PV波动
- 资源加载失败率
- 接口失败率
- JS错误率

快速定位：
- JS异常现场还原

:::tip
1. 堆栈信息和sourcemap可以快读定位程序异常
2. 客户端采集，内存保持最近N条行为数据，异常发生时合并上报。服务端重建，根据异常发生时会话ID，从行为数据中查询并关联。解决特定用户问题
3. 像素级用户行为回放：`LogRocket`
:::

异常分析：
- TopN 异常类型
- 异常页面
- 失败资源
- 失败接口

明确信息：
- JS异常堆栈信息
- 资源异常信息
- 接口异常信息
- 公共维度信息

## 告警策略
- 绝对值告警
- 波动告警
- 累计值告警