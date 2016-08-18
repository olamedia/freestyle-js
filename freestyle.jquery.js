(function($, freestyle){

	freestyle.queryAll = function(selector){
		var nodes = [];
		$(selector).each(function(){
			nodes.push(this);
		});
		return freestyle.wrap(nodes);
	};
	freestyle.query = function(selector){
		var nodes = [];
		var node = $(selector).get(0);
		if (node){
			nodes.push(node);
		};
		return freestyle.wrap(nodes);
	};

})(jQuery, freestyle);
