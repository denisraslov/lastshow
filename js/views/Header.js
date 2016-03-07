define([
	'views/Base',
	'views/Logo',
	'views/ArtistInput',
	'views/Menu',
	'views/AudioPlayer',
    'text!html/header.html'
], function(BaseView, LogoView, ArtistInputView, MenuView, AudioPlayerView, template)
{
	var HeaderView = BaseView.extend(
	{
		elClass: 'header',
		createViews: function()
		{
			BaseView.prototype.createViews.call(this);

			this.addView(LogoView, 'logo');
			this.addView(ArtistInputView, 'artistInput', { value: this.params.artist });
			this.addView(MenuView, 'menu');
			this.addPlayerView();
		},
		_getHtml: function()
		{
			var views = this.views;

			return _.template(template)(
			{
				logoHtml: views.logo.getHtml(),
				artistInputHtml: views.artistInput.getHtml(),
				menuHtml: views.menu.getHtml(),
				audioPlayerHtml: views.player ? views.player.getHtml() : ''
			});
		},

		//------------------ utility ----------------------

		addPlayerView: function()
		{
			if (this.params.player)
			{
				this.addView(AudioPlayerView, 'player');
				this.registerHandler('OnPrevTrackPlay', 'player', 'onPlayerPrevTrackPlay');
				this.registerHandler('OnNextTrackPlay', 'player', 'onPlayerNextTrackPlay');
			}
		},

		//--------------------- handlers --------------------

		onPlayerPrevTrackPlay: function()
		{
			this.trigger('OnPlayerPrevTrackPlay');
		},
		onPlayerNextTrackPlay: function()
		{
			this.trigger('OnPlayerNextTrackPlay');
		}
	});

	return HeaderView;
});
