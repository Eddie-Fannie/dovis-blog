# CSS常问面试题
## CSS优先级算法
| 选择器 | 优先级 |
|--------| -----|
| 元素选择符 | 1 |
| class选择符 | 10 |
| id选择符 | 100 |
| 元素标签 | 1000 |

+ 其他规则
    - `!important`声明样式优先级最高
    - 优先级相同，看最后出现的样式
    - 继承得到的样式优先级最低

## CSS3新特性
1. 过渡，动画，变换
过渡：

| 属性 | 说明 | 值 |
|-----|------|---|
|`transition-delay` | 指定过渡开始之前的延迟时间 | 时间 |
|`transition-duration`| 指定过渡的持续时间 | 时间 |
| `transition-property` | 指定应用过渡的属性 | 字符串 |
| `transition-timing-funtion` | 指定过渡期间计算中间值的方式 | `ease ease-in ease-out ease-in-out linear` 还有一个`cubic-bezier`贝塞尔曲线 |

简写：
```bash
transition: <transition-property> <transition-duration> <transition-timing-function> <transition-delay>
```

`cubic-bezier`
```css
transition-timing-function: cubic-bezier(p0,p1,p2,p3) /*四个点*/
```

动画：

| 属性 | 说明 | 值 |
|------|-----|----|
| `animation-delay` | 设置动画开始前的延迟 | 时间 s/ms |
| `animation-direction` | 设置动画循环播放的时候是否反向播放 | `normal/alternate` |
| `animation-duration` | 设置动画播放的持续时间 | 时间 |
| `animation-iteration-count` | 设置动画的播放次数 | `infinite`/数值 |
| `animation-name` | 动画名称 | * |
| `animation-play-state` | 允许动画暂停和重新播放 | `running/paused` |
| `animation-timing-function` | 如同上面 | * |

简写：
```bash
animation: <animation-name> <animation-duration> <animation-timing-function> <animation-delay> <animation-iteration-count>
```