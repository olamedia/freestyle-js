# freestyle-js

Ready to drop support for IE<10?
Similar to jQuery syntax wrapper for vanilla javascript methods.


```js
(function($){

  $.ready(function(){
  
    $.query('#mydiv').append($.queryAll('li').each(function(node, index){
      node.text('index: ' + index);
    }).detach()).append($.create('div').text('Hello, world!'));
    
  });
  
}(freestyle));
```

## freestyle

* nodeListWrapper query(selector)
* nodeListWrapper queryAll(selector)
* nodeListWrapper id(selector)
* ready(callback)
* get(url, options, resolve, reject) `not frozen`
* post(url, options, body, resolve, reject) `not frozen`

## nodeListWrapper

* String attr(name)
* nodeListWrapper attr(name, value)
* nodeListWrapper attr(name, null) `remove attribute`
* nodeListWrapper addClass(className)
* nodeListWrapper removeClass(className)
* nodeListWrapper toggleClass(className)
* nodeListWrapper each(function(value, key){})
* String text()
* nodeListWrapper text(text)
* nodeListWrapper on(eventName, callback, useCapture)
* nodeListWrapper off(eventName, callback, useCapture)
