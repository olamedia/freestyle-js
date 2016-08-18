var freestyle = (function(undefined){
	
	var TYPE_UNDEF = typeof undefined;
	var isUndef = function(v){
		return TYPE_UNDEF === typeof v;
	}
	var isNodeList = function(v){
		return NodeList.prototype.isPrototypeOf(v);
	};
	var isNode = function(v){
		return Node.prototype.isPrototypeOf(v);
	};
	


	var nodeListWrapper = function(nodes){
		var self = this;
		self.nodes = nodes;
		var each = self._each = function(callback){
			for (var i = 0; i < self.nodes.length; i++){
				callback(self.nodes[i], i);
			}
			return self;
		};
		self.each = function(callback){
			return each(function(v, k){
				callback(new nodeListWrapper([v]), k);
			});
		}
		self.children = function(){
			var nodes = [];
			each(function(node){
				for (var i = 0; i < node.childNodes.length; i++){
					nodes.push(node.childNodes[i]);
				}
			});
			return new nodeListWrapper(nodes);
		};
		self.addClass = function(className){
			return each(function(node){
				node.classList.add(className);
			});
		};
		self.removeClass = function(className){
			return each(function(node){
				node.classList.remove(className);
			});
		};
		self.toggleClass = function(className){
			return each(function(node){
				node.classList.toggle(className);
			});
		};
		self.detach = function(){
			return each(function(node){
				var parent = node.parentNode;
				if (parent){
					parent.removeChild(node);
				}
			});
		};
		self.append = function(nodesWrapper){
			return each(function(parentNode){
				nodesWrapper._each(function(node){
					parentNode.appendChild(node);
				});
			});
		};
		self.text = function(text){
			if (isUndef(text)){
				text = '';
				each(function(node){
					if (isNode(node)){
						text += node.innerText;
					}
				});
				return text;
			}
			return each(function(node){
				var textNode = document.createTextNode(text);
				node.appendChild(textNode);
			});
		};
		self[Symbol.iterator] = function(){
			var nextIndex = 0;
			return {
			   next: function(){
				   return nextIndex < self.nodes.length ?
				       {value: new nodeListWrapper([self.nodes[nextIndex++]]), done: false} :
				       {done: true};
			   }
			};
		};
		self.dir = function(){
			console.dir(self.nodes);
			return self;
		}
	};

	var freestyle = {
		nodes: function(nodes){
			return new nodeListWrapper(nodes);
		},
		create: function(tagName){
			return nodeListWrapper([document.createElement(tagName)]);
		},
		queryAll: function(selector){
			return new nodeListWrapper(document.querySelectorAll(selector));
		},
		query: function(selector){
			return new nodeListWrapper([document.querySelector(selector)]);
		}
	};
	
	
	
	
	
	return freestyle;
	
	
	
})();
