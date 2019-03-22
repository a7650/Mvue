import {Dep} from './observe.js'

export default function Watcher(vm, exp, cb) {
    this.cb = cb;
    this.vm = vm;
    this.exp = exp;
    this.value = this.get();
}
Watcher.prototype = {
    update: function () {
        this.run();    // 属性值变化收到通知
    },
    run: function () {
        var value = this.getVmVal(); // 取到最新值
        var oldVal = this.value;
        if (value !== oldVal) {
            this.value = value;
            this.cb.call(this.vm, value, oldVal); // 执行Compile中绑定的回调，更新视图
        }
    },
    get: function () {
        Dep.target = this;  // 将当前订阅者指向自己
        var value = this.getVmVal();    // 触发getter，添加自己到属性订阅器中
        Dep.target = null;    // 重置
        return value;
    },
    getVmVal: function () {
        var curval = this.vm._data,
            keys = this.exp.split('.');
        keys.forEach(function (key) {
            curval = curval[key]
        })
        return curval
    }
};