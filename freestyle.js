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
	
	var util = {
		computedStyle: function(node, key){
			var view = node.ownerDocument.defaultView;
			if (!view || !view.opener){
				view = window;
			}
			var computed = view.getComputedStyle(node); // IE 9+
			computed.getPropertyValue(key) || computed[key];
		}
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
		self.attr = function(key, value){
			if (isUndef(value)){
				if (self.nodes.length>0){
					return self.nodes[0].getAttribute(key);
				}
				return null;
			}
			return each(function(node){
				if (null === value){
					node.removeAttribute(key);
				}else{
					node.setAttribute(key, value);
				}
			});
		};
		self.style = function(key, value){
			if (isUndef(value)){
				if (self.nodes.length>0){
					return self.nodes[0].style[key]?self.nodes[0].style[key]:null;
				}
				return null;
			}
			return each(function(node){
				if (null === value){
					delete node.style[key];
				}else{
					node.style[key] = value;
				}
			});
		};
		self.on = function(eventName, callback, useCapture){
			return each(function(node){
				node.addEventListener(eventName, callback, useCapture?useCapture:false);
			});
		};
		self.off = function(eventName, callback, useCapture){
			return each(function(node){
				node.removeEventListener(eventName, callback, useCapture?useCapture:false);
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
		var prevDisplayMode = null;
		self.hide = function(){
			return self.toggle(false);
		};
		self.show = function(){
			return self.toggle(true);
		};
		self.toggle = function(state){
			return each(function(node){
				var attached = true;
				// TODO util.contains(document, node)
				var show = (('none' == node.style.display) || (attached && 'none' === util.computedStyle(node, 'display'))) || true === state;
				if (false === state){
					show = false;
				}
				if (show){
					node.style.display = node.style.__display?node.style.__display:'block';
					delete node.style.__display;
				}else{
					node.style.__display = node.style.display;
					node.style.display = 'none';
				}
			});
		};
		self.dir = function(){
			console.dir(self.nodes);
			return self;
		}
	};
/*
	var xhrObject = function() {
		try {
			return new XMLHttpRequest();
		}catch(e){}
	};
	var xhrTest = xhrObject();
	var xhrSupported = !!xhrTest && ("withCredentials" in xhrTest);

	var fetchSupported = "fetch" in window; // else load polyfill
*/
	var readyCallbacks = [];
	var isReady = false;
	var freestyle = {
		get: function(url, options, resolve, reject){
			options.method = "GET";
			options.headers || (options.headers = {});
			options.headers["X-Requested-With"] = "XMLHttpRequest";
			options.credentials = "same-origin";
			//  body: JSON.stringify(data),
			fetch(url, options).then(function(response) {
				// handle HTTP response
				!resolve || resolve(response);
			}, function(error) {
				// handle network error
				!reject || reject(response);
			});
		},
		post: function(url, options, body, resolve, reject){
			options.method = "POST";
			options.headers || (options.headers = {});
			options.headers["X-Requested-With"] = "XMLHttpRequest";
			options.credentials = "same-origin";
			options.body = body;
			//  body: JSON.stringify(data),
			fetch(url, options).then(function(response) {
				// handle HTTP response
				!resolve || resolve(response);
			}, function(error) {
				// handle network error
				!reject || reject(response);
			});
		},
		wrap: function(nodes){
			return new nodeListWrapper(nodes);
		},
		create: function(tagName){
			return nodeListWrapper([document.createElement(tagName)]);
		},
		id: function(id){
			return new nodeListWrapper([document.getElementById(id)]);
		},
		getTag: function(tagName){
			return new nodeListWrapper(document.getElementsByTagName(tagName));
		},
		getClass: function(className){
			return new nodeListWrapper(document.getElementsByClassName(className));
		},
		queryAll: function(selector){
			return new nodeListWrapper(document.querySelectorAll(selector));
		},
		query: function(selector){
			return new nodeListWrapper([document.querySelector(selector)]);
		},
		ready: function(callback){
			if (isReady){
				callback();
			}else{
				readyCallbacks.push(callback);
			}
		}
	};
	var $document = freestyle.wrap([document]);
	$document.on('DOMContentLoaded', function(){
		isReady = true;
		for (var i =0; i < readyCallbacks.length; i++){
			readyCallbacks[i]();
		}
		readyCallbacks = [];
	});
	
	
	
	return freestyle;
	
	
	
})();
	
	
