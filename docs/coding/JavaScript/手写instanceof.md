# 手写`instanceof`
- 首先获取类型的原型
- 然后获得对象的原型
- 然后一直循环判断对象的原型是否等于类型的原型，直到对象原型为 `null`，因为原型链最终为 `null`

```js
function myInstanceof(left, right) {
  // 基本数据类型都返回false
  if (typeof left !== 'object' || left === null) return false;
  let proto = Object.getPrototypeOf(left);
  while (true) {
    if (proto === null) return false;
    if (proto === right.prototype) return true;
    proto = Object.getPrototypeOf(proto);
  }
}

function myInstanceof(left,right) {
  if(typeof left !== 'object' || left === null) return false;
  let leftProto = left.__proto__;
  let rightProto = right.__proto__
  while(true) {
    if(leftProto === null) {
      return false;
    }
    if(leftProto === rightProto) {
      return true;
    }
    leftProto = leftProto.__proto__
  }
}
```