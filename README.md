# freestyle-js

Ready to drop support for IE<10?
Similar to jQuery syntax wrapper for vanilla javascript methods.


```js
(function($){

  $.query('#mydiv').append($.queryAll('li').each(function(node, index){
    node.text('index: ' + index);
  }).detach()).append($.create('div').text('Hello, world!'));



}(freestyle));
```
