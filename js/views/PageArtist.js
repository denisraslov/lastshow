define([
	'views/PageSystem',
	'views/PageContentArtist',
	'views/Header'
], function(SystemPageView, PageArtistContentView, HeaderView)
{
	var ArtistPageView = SystemPageView.extend(
	{
		elClass: 'pageartist',
		getTitle: function()
		{
			return this.params.id;
		},
		getContentConstr: function()
		{
			return PageArtistContentView;
		},

		//------------------------- utility ---------------------------

		addHeaderView: function()
		{
			this.addView(HeaderView, 'header',
			{
				artist: this.params.id,
				player: true
			});

			this.registerHandler('OnPlayerPrevTrackPlay', 'header', 'onPlayerPrevTrackPlay');
			this.registerHandler('OnPlayerNextTrackPlay', 'header', 'onPlayerNextTrackPlay');
		},
		addContentView: function()
		{
			this.addView(this.getContentConstr(), 'content', this.params);

			this.registerHandler('OnTrackPlay', 'content', 'onTrackPlay');
		},
		getAudioPlayer: function()
		{
			return this.views.header.views.player;
		},

		//---------------------- handlers -----------------------

		onTrackPlay: function(contentView, trackView)
		{
			this.getAudioPlayer().playTrack(trackView.params);
		},
		onPlayerPrevTrackPlay: function()
		{
			this.views.content.playPrevTrack(this.getAudioPlayer().settings.repeatType);
		},
		onPlayerNextTrackPlay: function()
		{
			this.views.content.playNextTrack(this.getAudioPlayer().settings.repeatType);
		}
	});

	//---------------- consts ---------------------------

	ArtistPageView.Consts =
	{
	};

	return ArtistPageView;
});
