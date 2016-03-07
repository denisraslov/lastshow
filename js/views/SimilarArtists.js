define([
	'views/Base',
	'views/Artist',
	'models/Audio',
	'text!html/similarArtists.html'
], function(BaseView, ArtistView, AudioModel, template)
{
	var SimilarArtistsView = BaseView.extend(
	{
		elClass: 'similarartists',
		_getHtml: function()
		{
			return template;
		},
		load: function()
		{
			var self = this;

			BaseView.prototype.load.call(this);

			AudioModel.Get().getSimilarArtists(this.params.artist, 6, function(artists)
			{
				self.hideLoader();
				self.addViews(artists);
			});
		},

		//---------------------- utility -----------------------

		addViews: function(artists)
		{
			var wrap = this.$el.find('.similarartists-content');
			var view;

			for (var i = 0; i < artists.length; i++)
			{
				view = this.addView(ArtistView, 'tour' + i,
				{
					id: artists[i],
					isLink: true
				});
				wrap.append(view.getHtml());
				view.load();
			}
		},
		hideLoader: function()
		{
			this.$el.find('.similarartists-loader').hide();
		}
	});

	//--------------- consts --------------------

	SimilarArtistsView.Consts =
	{
	};

	return SimilarArtistsView;
});
