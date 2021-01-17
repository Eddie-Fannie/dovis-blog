# css画东西
## 画一个扇形
- `clip: rect(top,right,bottom,left)`设置剪裁的形状
```html
<div class="sector"></div>
```

```css
.sector{
    width: 200px;
    height: 200px;
    border-radius: 200px;
    background-color: deepskyblue;
    position: relative;
}
.sector::before{
    content: "";
    width: 200px;
    height: 200px;
    position: absolute;
    background-color: white;
    border-radius: 200px;
    /*裁减半圆，再做旋转*/
    clip: rect(0px,100px,200px,0);
    transform: rotate(-60deg);
}
.sector::after{
    content: "";
    width: 200px;
    height: 200px;
    position: absolute;
    background-color: white;
    border-radius: 200px;
    /*裁减半圆，再做旋转*/
    clip: rect(0px,200px,200px,100px);
    transform: rotate(60deg);
}
```

- 利用`overflow:hidden`
```html
<div id="demo">
    <div id="circle"></div>
</div>
```

```css
#demo {
    position: relative;
    width: 50px;
    height: 50px;
    overflow: hidden;
}
#circle {
    position: absolute;
    width: 100px;
    height: 100px;
    background-color: black;
    border-radius: 50%;
}
```

- `border-radius`
```html
<div id="sector"></div>
```

```css
 #sector {
    width: 0;
    height: 0;
    border: 100px solid;
    border-radius: 100px;
    border-color: orangered transparent transparent transparent;
}
```