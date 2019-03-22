import Watcher from '../watcher.js'
import updater from './updater.js'

var compileUtil = {
    text: function (node, vm, exp) {
        this.bind(node, vm, exp, 'text')
    },
    html: function (node, vm, exp) {
        this.bind(node, vm, exp, 'html')
    },
    if: function (node, vm, exp,index) {
        var fn = updater.if,
        val = this.getVmVal(vm,exp),
        parentNode = node.parentNode;
        if(!val){
            parentNode.removeChild(node)
        }
        new Watcher(vm, exp, function (newVal, oldVal) {
            fn && fn(node,parentNode,index, newVal, oldVal)
        })
    },
    show:function(node, vm, exp){
        this.bind(node, vm, exp, 'show')
    },
    bind(node, vm, exp, dir) {
        var fn = updater[dir]
        fn && fn(node, this.getVmVal(vm, exp))
        new Watcher(vm, exp, function (newVal, oldVal) {
            fn && fn(node, newVal, oldVal)
        })
    },
    getVmVal(vm, exp) {
        var keys = exp.split('.'),
            curVal = vm._data;
        keys.forEach(function (key) {
            curVal = curVal[key]
        })
        if (curVal=='undefined') {
            throw new Error("data." + exp + " is undefined")
        }
        return curVal
    }
}

export default compileUtil