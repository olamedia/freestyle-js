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

* query(selector)
* queryAll(selector)
* id(selector)
* ready(callback)
* get(url, options, resolve, reject) `not frozen`
* post(url, options, body, resolve, reject) `not frozen`

## nodeListWrapper

* attr(name), attr(name, value), attr(name, null)
* addClass(className)
* removeClass(className)
* toggleClass(className)
* each(function(value, key){})
* text(), text(text)
* on(eventName, callback, useCapture), off(eventName, callback, useCapture)
