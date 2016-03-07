define([
	'views/PageSystem',
	'views/PageContentArtists'
], function(SystemPageView, PageArtistsContentView)
{
	var ArtistsPageView = SystemPageView.extend(
	{
		elClass: 'pageartists',
		getTitle: function()
		{
			return 'Рекомендуемые исполнители';
		},
		getContentConstr: function()
		{
			return PageArtistsContentView;
		}
	});

	return ArtistsPageView;
});
