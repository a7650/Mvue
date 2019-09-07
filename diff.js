const nodeOps = {
	insertBefore(parent,elm,ref){
		
	},
	appendChild(parent,elm){
		
	},
	createElm(tag){
		
	},
	createTextNode(text){
		
	},
	parentNode(el){
		
	},
	removeChild(parent,el){
		
	},
	setTextContent(elm,text){
		
	},
	nextSibling(elm){
		
	}
}

function insert(parent,elm,ref){
	if(parent){
		if(ref&&ref.parentNode===parent){
			nodeOps.insertBefore(parent,elm,ref)
		}else{
			nodeOps.appendChild(parent,elm)
		}
	}
}

function createElm(vnode,parentElm,refElm){
	if(vnode.tag){
		insert(parentElm,nodeOps.createElm(vnode.tag),refElm)
	}else{
		insert(parentElm,nodeOps.createTextNode(vnode.text),refElm)
	}
}

function addVnodes(parentElm,refElm,vnodes,start,end){
	for(;start<=end;satrt++){
		createElm(vnodes[start],parentElm,refElm)
	}
}

function removeNode(el){
	const parent = nodeOps.parentNode(el);
	if(parent){
		nodeOps.removeChild(parent,el)
	}
}

function removeVNodes(vnodes,start,end){
	for(;start<=end;start++){
		removeNode(vnodes[start].elm)
	}
}


//patch
//diff通过同层的树节点进行比较而非对树进行逐层遍历
function patch(oldVnode,vnode,parentElm){
	if(!oldVnode){
	//旧节点不存在时 直接添加新节点
		addVnodes(parentElm,null,0,vnode.length-1)
	}else if(!vnode){
		//新节点不存在 删除旧节点
		removeVnodes(oldVnode,0,oldVnode.length-1)
	}else{
		if(sameVnode(oldVnode,vnode)){
			//如果新旧相同 调用patchnode比较
			patchVnode(oldVnode,vnode)
		}else{
			//不同时删除旧节点 同时添加新节点
			removeVnodes(oldVnode,0,oldVnode.length-1)
			addVnodes(parentElm,null,vnode,0,vnode.length-1)
		}
	}
}

function sameVnode(a,b){
	return (
		a.key===b.key&&
		a.tag===b.tag&&
		a.isComment===b.isComment&&
		(!!a.data)===(!!b.data)&&
		sameInputType(a,b)
	)
}

function sameInputType(a,b){
	if(a.tag!=='input')return true;
	let i;
	const typeA = (i = a.data)&&(i = i.attrs)&&(i = i.type);
	const typeB = (i = b.data)&&(i = i.attrs)&&(i = i.type);
	return typeA === typeB
}

function patchVnode(oldVnode,vnode){
	if(oldVnode===vnode)return;
	if(vnode.isStatic && oldVnode.isStatic && vnode.key === oldVnode.key){
		vnode.elm = oldVnode.elm;
		vnode.componentsInstance = oldVnode.componentsInstance
		return
	}
	const elm = vnode.elm = oldVnode.elm,
	oldCh = oldVnode.children,
	ch = vnode.children;
	if(vnode.text){
		nodeOps.setTextContent(elm,vnode.text)
	}else{
		if(oldCh&&ch&&(oldCh!==Ch)){
			updateChildren(elm,oldCh,ch)
		}else if(!oldCh){
			if(oldVnode.text)nodeOps.setTextContent(elm,'');
			addVnodes(elm,null,ch,0,ch.length-1)
		}else if(!ch){
			removeVnodes(oldCh,0,oldCh.length-1)
		}else if(oldVnode.text){
			nodeOps.setTextContent(elm,'')
		}
	}
}

function updateChildren(parentElm,oldCh,newCh){
	let oldStartIdx = 0,
	newStartIdx = 0,
	oldEndIdx = oldCh.length-1,
	oldStartVnode = oldCh[0],
	oldEndVnode = oldCh[oldEndIdx],
	newEndIdx = newCh.length-1,
	newStartVnode = newCh[0],
	newEndVnode = newCh[newEndIdx],
	oldKeyToIdx,idxInOld,elmToMove,refElm;
	
	while(oldStartIdx<=oldEndIdx&&newStartIdx<=newEndIdx){
		if(!oldStartVnode){
			oldStartVnode = oldCh[++oldEndIdx]
		}else if(!oldEndVnode){
			oldEndVnode = oldCh[--oldEndIdx]
		}else if(sameVnode(oldStartVnode,newStartVnode)){
			patch(oldStartVnode,newStartVnode);
			oldStartVnode = oldCh[++oldStartIdx];
			newStartVnode = newCh[++newStartIdx];
		}else if(sameVnode(oldEndVnode,oldStartVnode)){
			patch(oldEndVnode,oldStartVnode);
			oldEndVnode = oldCh[--oldEndIdx];
			newEndVnode = newCh[--newEndIdx];
		}else if(sameVnode(newStartVnode,oldEndVnode)){
			patch(newStartVnode,oldEndVnode);
			insert(parentElm,oldEndVnode.elm,oldStartVnode.elm);
			oldEndVnode = oldCh[--oldEndIdx];
			newStartVnode = newCh[++newStartIdx];
		}else if(sameVnode(newEndVnode,oldStartVnode)){
			patch(newEndVnode,oldStartVnode);
			insert(parentElm,oldStartVnode.elm,nodeOps.nextSibling(oldEndVnode.elm));
			newEndVnode = newCh[--newEndIdx];
			oldStartVnode = oldCh[++oldStartIdx];
		}else{
			if(!oldKeyToIdx){
				oldKeyToIdx = createKeyToIdx(oldCh,oldStartIdx,oldEndIdx)
			}
			idxInOld = newStartVnode.key ? oldKeyToIdx[newStartVnode.key] : null;
			if(!idxInOld){
				createElm(newStartVnode,parentElm,oldStartVnode);
				newStartVnode = newCh[++newStartIdx];
			}else{
				elmToMove = oldCh[idxInOld];
				if(sameVnode(elmToMove,newStartVnode)){
					patch(elmToMove,newEndVnode);
					insert(parentElm,newStartVnode.elm,oldStartVnode.elm);
					oldCh[idxInOld] = undefined;
					newStartVnode = newCh[++newStartIdx];
				}else{
					createElm(newStartVnode,parentElm,oldStartVnode);
					newStartVnode = newCh[++newStartIdx];
				}
			}
		}
	}
	if(oldStartIdx>oldEndIdx){
		refElm = newCh[newEndIdx+1]?newCh[newEndIdx+1].elm:null;
		addVnodes(parentElm,refElm,newCh,newStartIdx,newEndIdx);
	}else if(newStartIdx>newEndIdx){
		removeVnodes(oldCh,oldStartIdx,oldEndIdx)
	}
}

function createKeyToIdx(ch,start,end){
	let map = {};
	for(let i = satrt;i<=end;i++){
		kti[ch[i].key] = i;
	}
	return map
}