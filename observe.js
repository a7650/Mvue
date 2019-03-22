export default function observe(data) {
    if (!data || typeof data != 'object') {
        return
    }
    Object.keys(data).forEach(function (key) {
        defineReactive(data, key, data[key])
    })
}
function defineReactive(data, key, val) {
    var dep = new Dep();
    observe(val);
    //给每一个属性定义setter和getter
    Object.defineProperty(data, key, {
        enumerable: true,
        configurable: false,
        get: function () {
            Dep.target && dep.addSub(Dep.target);//添加watcher
            return val
        },
        set: function (newVal) {
            if (val === newVal) return;
            val = newVal
            dep.notify()//通知watcher
        }

    })
}
export function Dep() {
    this.subs = []
}
Dep.prototype = {
    addSub: function (sub) {
        this.subs.push(sub)
    },
    notify: function () {
        this.subs.forEach(function (sub) {
            sub.update()
        })
    }
}
Dep.target = null;