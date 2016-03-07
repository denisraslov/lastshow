define([
	'views/Base',
	'views/Artist',
	'models/Audio',
	'text!html/pageContentArtists.html'
], function(BaseView, ArtistView, AudioModel, template)
{
	var ArtistsPageContentView = BaseView.extend(
	{
		elClass: 'pagecontentartists',
		_getHtml: function()
		{
			return template;
		},
		load: function()
		{
			var self = this;

			BaseView.prototype.load.call(this);

			AudioModel.Get().getUserArtists(ArtistsPageContentView.Consts.ARTISTS_COUNT, function(artists)
			{
				var artistView;

				self.parent.hideLoader();

				for (var i = 0; i < artists.length; i++)
				{
					artistView = self.addView(ArtistView, 'artist' + i, { id: artists[i], isLink: true });
					artistView.init();
					$('.pagecontentartists-artists').append(artistView.getHtml());
					artistView.load();
				}
			})
		}
	});

	//---------------- consts ---------------------------

	ArtistsPageContentView.Consts =
	{
		ARTISTS_COUNT: 12
	};

	return ArtistsPageContentView;
});
