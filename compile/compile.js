import compileUtil from './compileUtil.js'


export default function Compile(el, vm) {
    this.$vm = vm
    this.$el = this.isElementNode(el) ? el : document.querySelector(el)
    if(!this.$el){
        throw new Error('你所注册的模板元素不存在')
    }else{
        this.$fragment = this.node2Fragment(this.$el)
        this.init()
        this.$el.appendChild(this.$fragment)
    }
}
Compile.prototype = {
    init: function () {
        this.compileElement(this.$fragment)
    },
    compileElement: function (fragment) {
        var childNodes = fragment.childNodes,
            self = this;
        [].slice.call(childNodes).forEach(function (node,index) {
            var text = node.textContent,
                reg = /\{\{(.*)\}\}/;
            if (self.isElementNode(node)) {
                self.compileElementNode(node,index)
            } else if (self.isTextNode(node) && reg.test(text)) {
                self.compileTextNode(node, RegExp.$1);
            }

            if (node.childNodes && node.childNodes.length) {
                self.compileElement(node)
            }

        })
    },
    compileElementNode(node,index) {
        var attrs = node.attributes,
            self = this;
        if (!attrs.length) { return }
        [].slice.call(attrs).forEach(function (attr) {
            var attrName = attr.name
            if (self.isDirective(attrName)) {
                var exp = attr.value,
                    dir = attr.name.substring(2);
                if (self.isEventDirective(attrName)) {
                    self.eventHandle(node, self.$vm, dir, exp)
                } else {
                    compileUtil[dir] && compileUtil[dir](node, self.$vm, exp,index)
                }
                node.removeAttribute(attrName)
            }
        })
    },
    isDirective(attr) {
        var n = attr.indexOf('v-')
        return n === 0
        // return attr.indexOf('v-') === 0
    },
    isEventDirective(attr) {
        var n = attr.indexOf('on')
        return n === 0
    },
    eventHandle(node, vm, dir, exp) {
        var eventType = dir.split(':')[1],
            fn = vm.$options.methods && vm.$options.methods[exp];
        if (eventType && fn) {
            node.addEventListener(eventType, fn.bind(vm))
        }
    },
    compileTextNode(node, exp) {
        compileUtil.text(node, this.$vm, exp)
    },
    isElementNode(el) {
        return el.nodeType === 1
    },
    isTextNode: function (el) {
        return el.nodeType === 3
    },
    node2Fragment: function (el) {
        var fragment = document.createDocumentFragment(),
            child = el.firstElementChild;
        fragment.appendChild(child)
        return fragment
    }
}