define([
	'views/Base',
	'views/Artist',
	'views/Tracks',
	'views/ToursList',
	'views/SimilarArtists',
	'models/Audio',
	'text!html/pageContentArtist.html'
], function(BaseView, ArtistView, TracksView, ToursListView, SimilarArtistsView, AudioModel, template)
{
	var ArtistPageContentView = BaseView.extend(
	{
		elClass: 'pagecontentartist',
		_getHtml: function()
		{
			return template;
		},
		load: function()
		{
			BaseView.prototype.load.call(this);

			this.prepareSetlist();
		},

		//--------------------- setlists -------------------------

		prepareSetlist: function()
		{
			var params = this.params;
			var artist = params.id;
			var tour = params.tour;

			if (tour)
			{
				this.prepareTourSetlist(artist, tour);
			}
			else
			{
				this.prepareLastSetlist(artist);
			}
		},
		prepareTourSetlist: function(artist, tour)
		{
			var self = this;

			AudioModel.Get().getTourSetlist(artist, tour, function(tracks)
			{
				if (tracks.length > 0)
				{
					self.addViews({ tour: tour }, tracks);
				}
				else
				{
					self.showError();
				}
			});
		},
		prepareLastSetlist: function(artist)
		{
			var self = this;

			AudioModel.Get().getLastSetlist(artist, function(setlist)
			{
				if (setlist)
				{
					self.addViews(setlist.info, setlist.tracks);
				}
				else
				{
					self.showError();
				}
			});
		},

		//------------------------- utility ---------------------------

		showError: function()
		{
			this.$el.find('.pagecontentartist-error').show();

			this.parent.hideLoader();
		},
		addViews: function(info, tracks)
		{
			this.parent.hideLoader();
			$('.pagecontentartist-content').show();

			this.addArtist(info);
			this.addTracks(tracks);
		},
		addArtist: function(show)
		{
			var artist = this.params.id;
			var artistWrap = $('.pagecontentartist-artist', this.$el);
			var artistView;

			artistView = this.addView(ArtistView, 'artist',
			{
				id: artist,
				show: show,
				isLink: false
			});

			artistWrap.append(artistView.getHtml());
			artistView.load();
		},
		addTracks: function(tracks)
		{
			var artist = this.params.id;
			var tracksWrap = $('.pagecontentartist-tracks', this.$el);
			var tracksView;

			tracksView = this.addView(TracksView, 'tracks',
			{
				artist: artist,
				tracks: tracks
			});

			this.registerHandler('OnTracksAdded', 'tracks', 'addTours');
			this.registerHandler('OnTrackPlay', 'tracks', 'onTrackPlay');

			tracksWrap.append(tracksView.getHtml());
			tracksView.load();
		},
		addTours: function()
		{
			var toursWrap = $('.pagecontentartist-tours', this.$el);
			var view = this.addView(ToursListView, 'tours',
			{
				artist: this.params.id,
				activeTour: this.params.tour
			});

			this.registerHandler('OnLoaded', 'tours', 'addSimilarArtists');

			toursWrap.append(view.getHtml());
			view.load();
		},
		addSimilarArtists: function()
		{
			var toursWrap = $('.pagecontentartist-similarartists', this.$el);
			var view = this.addView(SimilarArtistsView, 'similarArtists',
			{
				artist: this.params.id
			});

			toursWrap.append(view.getHtml());
			view.load();
		},

		//----------------------- play tracks -----------------------

		playPrevTrack: function(repeatType)
		{
			this.views.tracks.playPrevTrack(repeatType);
		},
		playNextTrack: function(repeatType)
		{
			this.views.tracks.playNextTrack(repeatType);
		},

		//---------------------- handlers -----------------------

		onTrackPlay: function(tracksView, trackView)
		{
			trackView.params.artist = tracksView.params.artist;

			this.trigger('OnTrackPlay', [trackView]);
		}
	});

	//---------------- consts ---------------------------

	ArtistPageContentView.Consts =
	{
	};

	return ArtistPageContentView;
});
