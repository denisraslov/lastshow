define([
	'views/Base',
	'models/LastFM',
    'text!html/audioPlayer.html'
], function(BaseView, LastFMModel, template)
{
	var AudioPlayerView = BaseView.extend(
	{
		elClass: 'audioplayer',
		events:
		{
			'click .audioplayer-repeat':    'changeRepeatType',
			'click .audioplayer-prev':      'playPrevTrack',
			'click .audioplayer-next':      'playNextTrack'
		},
		_getHtml: function()
		{
			return template;
		},
		init: function()
		{
			BaseView.prototype.init.call(this);

			this.settings =
			{
				repeatType: AudioPlayerView.Consts.RepeatTypes.NONE
			};
		},
		load: function()
		{
			BaseView.prototype.load.call(this);

			this.preparePlayer();
		},

		//------------------------ utility -----------------------------

		preparePlayer: function()
		{
			var self = this;

			this.player = new MediaElementPlayer('audio',
			{
				mode: 'shim',
				audioWidth: 600,
				success: function(player, domObject)
				{
					player.addEventListener('timeupdate', function(event)
					{
						self.onTrackTimeUpdate(player);
					}, false);

					player.addEventListener('ended', function(event)
					{
						if (self.track.started)
						{
							self.playNextTrack();
						}
						else
						{
							console.log('play with bag');
							player.play();
						}
					}, false);

					player.addEventListener('play', function(event)
					{
						$('.favicon').attr('href', 'img/favicon-play.png');
					}, false);

					player.addEventListener('pause', function(event)
					{
						$('.favicon').attr('href', 'img/favicon.png');
					}, false);
				}
			});
		},

		//-------------------------- handlers --------------------------

		onTrackTimeUpdate: function(player)
		{
			var track = this.track;

			track.started = true;

			if (player.currentTime > AudioPlayerView.Consts.TRACK_SCROBBLE_TIME && !track.scrobbled)
			{
				track.scrobbled = true;
				LastFMModel.Get().scrobbleTrack(track.artist, track.title, function()
				{
				});
			}
		},

		//---------------------- interface ------------------------

		changeRepeatType: function()
		{
			var RepeatTypes = AudioPlayerView.Consts.RepeatTypes;
			var repeatButton = $('.audioplayer-repeat', this.$el);

			switch (this.settings.repeatType)
			{
				case RepeatTypes.NONE:
					this.settings.repeatType = RepeatTypes.ALL;
					repeatButton.attr('src', 'img/repeat-all.png');
					repeatButton.attr('title', 'Повторять сетлист');
					break;
				case RepeatTypes.ALL:
					this.settings.repeatType = RepeatTypes.ONE;
					repeatButton.attr('src', 'img/repeat-one.png');
					repeatButton.attr('title', 'Повторять трек');
					break;
				case RepeatTypes.ONE:
					this.settings.repeatType = RepeatTypes.NONE;
					repeatButton.attr('src', 'img/repeat-no.png');
					repeatButton.attr('title', 'Не повторять');
					break;
			}
		},
		playPrevTrack: function()
		{
			this.trigger('OnPrevTrackPlay');
		},
		playNextTrack: function()
		{
			this.trigger('OnNextTrackPlay');
		},
		playTrack: function(track)
		{
			var title = track.title;

			this.player.pause();
			this.player.setSrc(track.url);
			this.player.play();

			this.track = track;
			this.track.started = false;
			this.track.scrobbled = false;

			$('.audioplayer-current-track', this.$el).html(title);

			LastFMModel.Get().updateStatus(track.artist, track.title, function()
			{
			});
		}
	});

	//--------------- const ------------------

	AudioPlayerView.Consts =
	{
		RepeatTypes:
		{
			NONE:   0,
			ALL:    1,
			ONE:    2
		},
		TRACK_SCROBBLE_TIME: 90
	};

	return AudioPlayerView;
});
