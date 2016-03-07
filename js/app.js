
define([
	'models/VK',
	'router',
], function(VKModel, Router)
{
	var init = function()
	{
		VKModel.Get().init();
		Router.init();
	};

	return {
		init: init
	};
});
