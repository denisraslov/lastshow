
require.config(
{
	paths:
	{
		html: '../html'
	}
});

require([
	'app',
], function(App)
{
	App.init();
});
