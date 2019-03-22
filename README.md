# Mvue
#### 一个简单vue响应式框架

### 使用方法（基本上和vue一样）
1. 需要用es6支持，import Mvue.js
2. 也可以只用Mvue.min.js，引入js即可

使用任何一种方法引入Mvue后，直接 new Mvue(options) 即可

options的选项可以是：el(必填)，data(必填)，目前只支持这两个属性。

其他的元素属性目前支持 v-html,v-text,v-if,v-show

同样，也可以用{{some data}}
