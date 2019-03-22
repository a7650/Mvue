var  updater = {
    text: function (node, value) {
        node.textContent = typeof value === 'undefined' ? '' : value
    },
    html: function (node, value) {
        node.innerHTML = typeof value === 'undefined' ? '' : value
    },
    if: function (node,parentNode, index,value) {
        var nodes = parentNode.childNodes;
        if (value) {
            if(index===nodes.length-1){
                parentNode.appendChild(node)
            }else{
                parentNode.insertBefore(node,nodes[index+1])
            }
        } else {
            parentNode.removeChild(node)
        }
    },
    show:function(node, value){
        var display = value?'':'none';
        node.style.display = display
    }
}

export default updater