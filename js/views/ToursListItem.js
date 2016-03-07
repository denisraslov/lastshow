define([
	'router',
	'views/Base',
	'text!html/toursListItem.html'
], function(Router, BaseView, template)
{
	var ToursListItemView = BaseView.extend(
	{
		elClass: 'tourslistitem',
		events:
		{
			'click': 'onClick'
		},
		_getHtml: function()
		{
			var params = this.params;

			return _.template(template)(
			{
				id: params.title,
				artist: params.artist,
				showsCount: params.setlistsCount + (params.showsCaption ? ' концертов' : ''),
				active: params.active
			});
		},

		//---------------------- handlers ----------------------

		onClick: function()
		{
			var params = this.params;

			Router.instance.navigate('artist', { id: artist, tour: params.title });

			return false;
		}
	});

	//--------------- consts --------------------

	ToursListItemView.Consts =
	{
	};

	return ToursListItemView;
});
