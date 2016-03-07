define([
	'utility/Date'
], function(DateUtility)
{
	var SetlistFMModel = Backbone.Model.extend(
	{
		//--------------------- methods ------------------------------------

		getLastSetlist: function(artist, callback)
		{
			var self = this;

			this.getSetlists(artist, null, 1, function(data)
			{
				var setlists = $('setlist', data);
				var setlist;

				if (setlists.length != 0)
				{
					setlist = self.prepareLastSetlist(setlists);
				}

				if (setlist)
				{
					setlist = self.prepareSetlist(setlist);
				}

				callback(setlist);
			});
		},
		getSetlists: function(artist, tour, page, callback)
		{
			var url;

			url = 'http://api.setlist.fm/rest/0.1/search/setlists?artistName=' + encodeURIComponent(artist);
			if (tour)
			{
				url += '&tour=' + encodeURIComponent(tour);
			}
			url += '&p=' + page;

			this.sendRequest(url, 'GET', callback);
		},
		getArtistTours: function(artist, callback)
		{
			var self = this;

			this.getArtistStatsUrl(artist, function(artistUrl)
			{
				self.sendRequest(artistUrl, 'GET', function(html)
				{
					var tourElements = $(html).find('.artistTours .artistToursCont li');
					var tourSpans;
					var title;
					var setlistsCount;
					var tour;
					var tours = [];
					var tourDatesDeferreds = [];

					for (var i = 0; i < tourElements.length; i++)
					{
						tourSpans = $(tourElements[i]).find('a > span');

						title = $(tourSpans[0]).html();
						setlistsCount = $(tourSpans[1]).html();

						if (setlistsCount > SetlistFMModel.Consts.MIN_TOUR_SETLISTS_COUNT)
						{
							tour =
							{
								title: title,
								setlistsCount: setlistsCount
							};
							tours.push(tour);

							tourDatesDeferreds.push(self.prepareTourDates(artist, tour));
						}
					}

					$.when.apply($, tourDatesDeferreds).done(function()
					{
						tours = _.sortBy(tours, function(tour)
						{
							return tour.interval.start;
						});

						callback(tours);
					});
				});
			})
		},
		prepareTourDates: function(artist, tour)
		{
			var self = this;
			var startDateDeferred = $.Deferred();
			var finishDateDeferred = $.Deferred();
			var lastPageIndex;

			lastPageIndex = Math.ceil(tour.setlistsCount / 20);

			tour.interval = {};

			this.getSetlists(artist, tour.title, 1, function(data)
			{
				var setlists = $('setlist', data);

				tour.interval.finish = self.getDate(setlists.first().attr('eventDate'));
				finishDateDeferred.resolve();

				if (lastPageIndex == 1)
				{
					tour.interval.start = self.getDate(setlists.last().attr('eventDate'));
					startDateDeferred.resolve();
				}
			});

			if (lastPageIndex > 1)
			{
				this.getSetlists(artist, tour.title, lastPageIndex, function(data)
				{
					var setlists = $('setlist', data);

					tour.interval.start = self.getDate(setlists.last().attr('eventDate'));
					startDateDeferred.resolve();
				});
			}

			return $.when(startDateDeferred, finishDateDeferred);
		},
		getArtistStatsUrl: function(artist, callback)
		{
			this.getArtistUrlPart(artist, function(urlPart)
			{
				var consts = SetlistFMModel.Consts;

				callback(consts.URL + '/' + consts.ARTIST_STATS_FOLDER + '/' + urlPart);
			});
		},
		getTourSetlistUrl: function(artist, tour, callback)
		{
			this.getArtistUrlPart(artist, function(urlPart)
			{
				var consts = SetlistFMModel.Consts;
				var url;

				if (urlPart)
				{
					url = consts.URL + '/' + consts.TOUR_SETLIST_FOLDER + '/' + urlPart + '?tour=' + encodeURIComponent(tour);
				}

				callback(url);
			});
		},
		getArtistUrlPart: function(artist, callback)
		{
			var consts = SetlistFMModel.Consts;
			var url = consts.URL + '/search?query=' + encodeURIComponent(artist);

			this.sendRequest(url, 'GET', function(html)
			{
				var url = $(html).find('.searchTopArtist a').attr('href');

				if (url)
				{
					url = url.split('/').pop();
				}

				callback(url);
			});
		},
		getTourSetlist: function(artist, tour, callback)
		{
			var self = this;

			this.getTourSetlistUrl(artist, tour, function(url)
			{
				if (url)
				{
					self.sendRequest(url, 'GET', function(html)
					{
						var trackElements = $(html).find('.songLabel');
						var track = {};
						var tracks = [];

						trackElements.each(function(index, el)
						{
							track =
							{
								title: $(el).html()
							};

							tracks.push(track);
						});

						callback(tracks);
					});
				}
				else
				{
					callback([]);
				}
			});
		},

		//------------------------------- setlists utility ----------------------------------

		prepareLastSetlist: function(setlists)
		{
			var setlistIndex = -1;
			var setlist;
			var tracksCount;
			var prevSetlist;

			if (setlists.length > 0)
			{
				do
				{
					setlistIndex++;
					setlist = $(setlists[setlistIndex]);
				}
				while (setlistIndex < setlists.length && $('song', setlist).length == 0);
			}

			tracksCount = $('song', setlist).length;
			if (tracksCount != 0)
			{
				//если в предыдущем концерте больше хотя бы на 3 песни, берём его,
				//потому что последним может оказаться слишком маленький концерт
				prevSetlist = setlists[setlistIndex + 1];
				if (tracksCount < 10 && prevSetlist && $('song', prevSetlist).length - tracksCount >= 3)
				{
					setlist = $(prevSetlist);
				}

				return setlist;
			}
		},
		prepareSetlist: function(setlist)
		{
			var info =
			{
				tour: setlist.attr('tour'),
				artist: $('artist', setlist).attr('name'),
				date: this.prepareDate(setlist.attr('eventDate')),
				venue: $('venue', setlist).attr('name') + ' (' +
					$('city', setlist).attr('name') + ', ' +
					$('country', setlist).attr('name') + ')'
			};

			var sets = $('set', setlist);
			var track;
			var setName;
			var setObj;
			var encore;
			var songs;
			var tracks = [];
			var title;
			var songInfo;

			for (var i = 0; i < sets.length; i++)
			{
				setObj = sets[i];

				setName = $(setObj).attr('name');

				encore = $(setObj).attr('encore');
				if (encore)
				{
					setName = 'Бис' + (encore == 1 ? '' : ' ' + encore) + (setName ? ': ' + setName : '');
				}

				songs = $('song', setObj);
				for (var j = 0; j < songs.length; j++)
				{
					title = $(songs[j]).attr('name');

					if (title)
					{
						track =
						{
							title: title,
							setName: setName
						};

						songInfo = $(songs[j]).find('info');
						if (songInfo) {
							track.info = songInfo.html();
						}
						tracks.push(track);
					}
				}
			}

			return {
				info: info,
				tracks: tracks
			};
		},

		//-------------------------- utility --------------------------------

		sendRequest: function(url, type, callback)
		{
			$.ajax({
				url: 'php/proxy.php?request_method=' + type + '&url=' +  encodeURIComponent(url),
				type: type,
				success: callback
			});
		},
		getDate: function(dateString)
		{
			return moment(dateString, 'DD-MM-YYYY');
		},
		prepareDate: function(dateString)
		{
			var moment = this.getDate(dateString);

			return moment.date() + ' ' + DateUtility.Consts.Monthes[moment.month()] + ' ' + moment.year() + ' года';
		}
	});

	//---------------------- const ---------------------------

	SetlistFMModel.Consts =
	{
		URL: 'http://www.setlist.fm',
		ARTIST_STATS_FOLDER: 'stats',
		TOUR_SETLIST_FOLDER: 'stats/average-setlist',
		MIN_TOUR_SETLISTS_COUNT: 1
	};

	//-------------------- static ---------------------------

	SetlistFMModel.Get = function(options)
	{
		this.instance = this.instance || new SetlistFMModel(options);

		return this.instance;
	};

	return SetlistFMModel;
});
