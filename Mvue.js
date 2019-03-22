import observe from './observe.js'
import Compile from './compile/compile.js'

export default function Mvue(options) {
    this.$options = options;
    var self = this,
        data = this._data = this.$options.data;
    Object.keys(data).forEach(function (key) {
        self._proxy(key)
    })
    observe(data, this);
    if(!options.el){
        throw new Error('Mvue的参数中，el是必须的，请在注册DOM时传入正确的el属性')
    }
    this.$compile = new Compile(options.el, this)
    return this
}

Mvue.prototype = {
    _proxy: function (key) {
        var self = this
        Object.defineProperty(self, key, {
            configurable: false,
            enumerable: true,
            get: function () {
                return self._data[key]
            },
            set: function (newVal) {
                self._data[key] = newVal
            }
        })
    }
}
