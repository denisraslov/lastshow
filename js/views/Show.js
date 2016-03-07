define([
	'views/Base',
    'text!html/show.html'
], function(BaseView, template)
{
	var ShowView = BaseView.extend(
	{
		elClass: 'show',
		_getHtml: function()
		{
			var params = this.params;

			return _.template(template)(
			{
				date: params.date,
				venue: params.venue,
				tour: params.tour
			});
		}
	});

	return ShowView;
});
