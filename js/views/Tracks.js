define([
	'views/Base',
	'views/Set',
	'views/Track',
	'views/AudioPlayer',
	'models/Audio',
	'text!html/tracks.html'
], function(BaseView, SetView, TrackView, AudioPlayerView, AudioModel, template)
{
	var TracksView = BaseView.extend(
	{
		elClass: 'tracks',
		init: function()
		{
			BaseView.prototype.init.call(this);

			this.setIndex = 0;
			this.trackViews = [];
		},
		_getHtml: function()
		{
			return template;
		},
		load: function()
		{
			BaseView.prototype.load.call(this);

			this.addTracks();
		},

		//------------------ utility --------------------

		addTracks: function()
		{
			this.addTrack(this.params.tracks, 0);
		},
		addTrack: function(tracks, trackIndex)
		{
			var self = this;
			var track;
			var artist = this.params.artist;
			var trackViews = this.trackViews;

			if (trackIndex < tracks.length)
			{
				track = tracks[trackIndex];

				AudioModel.Get().getTrackUrl(artist, track.title, function(trackUrl)
				{
					track.index = trackIndex;
					track.url = trackUrl;
					self.addTrackViews(track);

					setTimeout(function()
					{
						self.addTrack(tracks, trackIndex + 1);
					},
					TracksView.Consts.LOAD_TRACKS_TIMEOUT);
				});
			}
			else
			{
				trackViews[trackViews.length - 2].hideLoader();
				this.trigger('OnTracksAdded');
			}
		},
		addTrackViews: function(track)
		{
			this.prepareTrackLoader(track.index);

			if (this.currentSetName != track.setName)
			{
				this.addSetView(track.setName);
				this.currentSetName = track.setName;
				this.setIndex++;
			}

			this.addTrackView(track);
		},
		prepareTrackLoader: function(trackIndex)
		{
			var trackViews = this.trackViews;

			if (trackIndex > 0 && trackIndex < this.params.tracks.length)
			{
				trackViews[trackIndex - 1].showLoader();

				if (trackIndex > 1)
				{
					trackViews[trackIndex - 2].hideLoader();
				}
			}
		},
		addSetView: function(title)
		{
			var setView;

			setView = this.addView(SetView, 'set' + this.setIndex,
			{
				title: title
			});

			this.$el.append(setView.getHtml());
			setView.load();
		},
		addTrackView: function(track)
		{
			var trackViewName = 'track' + track.index;
			var trackView;

			trackView = this.addView(TrackView, trackViewName,
			{
				artist: this.params.artist,
				title: track.title,
				setName: track.setName,
				info: track.info,
				url: track.url
			});

			this.trackViews.push(trackView);
			this.registerHandler('OnPlay', trackViewName, 'playTrack');

			this.$el.append(trackView.getHtml());
			trackView.load();
		},

		//------------------------ prev / next track -----------------------------

		playPrevTrack: function(repeatType)
		{
			var RepeatTypes = AudioPlayerView.Consts.RepeatTypes;
			var trackViews = this.trackViews;
			var activeTrackIndex = trackViews.indexOf(this.activeTrack);
			var prevTrackIndex;

			if (activeTrackIndex != -1)
			{
				switch (repeatType)
				{
					case RepeatTypes.NONE:
						prevTrackIndex = (activeTrackIndex == 0 ? activeTrackIndex : activeTrackIndex - 1);
						break;
					case RepeatTypes.ALL:
						prevTrackIndex = (activeTrackIndex == 0 ? trackViews.length - 1 : activeTrackIndex - 1);
						break;
					case RepeatTypes.ONE:
						prevTrackIndex = activeTrackIndex;
						break;
				}

				this.playTrack(trackViews[prevTrackIndex]);
			}
		},
		playNextTrack: function(repeatType)
		{
			var RepeatTypes = AudioPlayerView.Consts.RepeatTypes;
			var trackViews = this.trackViews;
			var activeTrackIndex = trackViews.indexOf(this.activeTrack);
			var nextTrackIndex;

			if (activeTrackIndex != -1)
			{
				switch (repeatType)
				{
					case RepeatTypes.NONE:
						nextTrackIndex = (activeTrackIndex == trackViews.length - 1 ? activeTrackIndex : activeTrackIndex + 1);
						break;
					case RepeatTypes.ALL:
						nextTrackIndex = (activeTrackIndex == trackViews.length - 1 ? 0 : activeTrackIndex + 1);
						break;
					case RepeatTypes.ONE:
						nextTrackIndex = activeTrackIndex;
						break;
				}

				this.playTrack(trackViews[nextTrackIndex]);
			}
		},

		//------------------------- handlers ---------------------------

		playTrack: function(trackView)
		{
			if (this.activeTrack)
			{
				this.activeTrack.stop();
			}

			trackView.play();
			this.activeTrack = trackView;
			this.trigger('OnTrackPlay', [trackView]);
		}
	});

	//---------------- consts ---------------------------

	TracksView.Consts =
	{
		LOAD_TRACKS_TIMEOUT: 300
	};

	return TracksView;
});
