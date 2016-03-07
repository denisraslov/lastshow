define([
	'views/Base',
	'text!html/set.html'
], function(BaseView, template)
{
	var SetView = BaseView.extend(
	{
		elClass: 'set',
		_getHtml: function()
		{
			var params = this.params;

			return _.template(template)(
			{
				title: params.title
			});
		}
	});

	return SetView;
});
