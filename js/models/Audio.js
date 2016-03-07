define([
	'models/VK',
	'models/LastFM',
	'models/SetlistFM'
], function(VKModel, LastFMModel, SetlistFMModel)
{
	var AudioModel = Backbone.Model.extend(
	{
		//------------------------- cashe ------------------------

		cashe: {},
		getFromCashe: function(artist, propsChain, getter, callback)
		{
			var self = this;
			var cashe = this.cashe;
			var casheProp;
			var casheObj;
			var cashedValue;

			cashe[artist] = cashe[artist] || {};

			casheObj = cashe[artist];

			for (var i = 0; i < propsChain.length - 1; i++)
			{
				casheProp = propsChain[i];
				casheObj[casheProp] = casheObj[casheProp] || {};

				casheObj = casheObj[casheProp];
			}
			casheProp = propsChain[propsChain.length - 1];

			cashedValue = casheObj[casheProp];

			if (cashedValue)
			{
				callback(cashedValue);
			}
			else
			{
				getter(function(value)
				{
					casheObj[casheProp] = value;

					callback(value)
				});
			}
		},

		//------------------------- utility ------------------------

		getArtists: function(searchString, limit, callback)
		{
			var self = this;

			LastFMModel.Get().getArtists(searchString, limit * AudioModel.Consts.ARTISTS_COUNT_RESERVE_FACTOR, function(artists)
			{
				artists = self.prepareArtists(artists, limit);

				callback(artists);
			});
		},
		getTrackUrl: function(artist, track, callback)
		{
			this.getFromCashe(artist, ['tracks', track], function(newCallback)
			{
				VKModel.Get().getTrackUrl(artist, track, newCallback);
			},
			callback);
		},
		getArtistTours: function(artist, callback)
		{
			this.getFromCashe(artist, ['tours'], function(newCallback)
			{
				SetlistFMModel.Get().getArtistTours(artist, newCallback);
			}, callback);
		},
		getTourSetlist: function(artist, tour, callback)
		{
			SetlistFMModel.Get().getTourSetlist(artist, tour, callback);
		},
		getLastSetlist: function(artist, callback)
		{
			SetlistFMModel.Get().getLastSetlist(artist, callback);
		},
		getUserArtists: function(limit, callback)
		{
			var self = this;

			var newCallback = function(artists)
			{
				self.userArtists = artists;
				//artists.shuffle();

				callback(artists);
			}

			VKModel.Get().getUserTracks(AudioModel.Consts.ARTISTS_GET_TRACKS_COUNT, function(items)
			{
				var artists;

				artists = self.prepareArtists($.map(items, function(item)
				{
					return item.artist;
				}), limit);

				if (artists.length > 0)
				{
					if (artists.length < limit)
					{
						limit = limit - artists.length;

						self.getSimilarArtists(artists[0], limit * AudioModel.Consts.ARTISTS_COUNT_RESERVE_FACTOR,
						function(similarArtists)
						{
							similarArtists = self.prepareArtists(similarArtists, limit);
							artists = artists.concat(similarArtists);

							newCallback(artists);
						});
					}
					else
					{
						newCallback(artists);
					}
				}
				else
				{
					LastFMModel.Get().getTopArtists(limit * AudioModel.Consts.ARTISTS_COUNT_RESERVE_FACTOR, function(artists)
					{
						artists = self.prepareArtists(artists, limit);
						newCallback(artists);
					});
				}
			});
		},
		getSimilarArtists: function(artist, limit, callback)
		{
			LastFMModel.Get().getSimilarArtists(artist, limit, callback);
		},
		getArtistImg: function(artist, callback)
		{
			this.getFromCashe(artist, ['img'], function(newCallback)
			{
				LastFMModel.Get().getArtistImg(artist, newCallback);
			},
			callback);
		},

		//-------------------------- artists validation -------------------------------------

		prepareArtists: function(artists, limit)
		{
			var preparedArtists = [];
			var artist;

			for (var i = 0; i < artists.length; i++)
			{
				artist = artists[i];
				artist = this.removeDuplicateSpaces(artist);

				if (preparedArtists.indexOf(artist) == -1 &&
					!this.isHaveRussianChars(artist) &&
					!this.isHaveForbiddenChars(artist) &&
					!this.isFeatArtist(artist) &&
					!this.isForbiddenArtist(artist))
				{
					preparedArtists.push(artist);
				}
			}

			limit = limit || preparedArtists.length;
			limit = Math.min(limit, preparedArtists.length);

			preparedArtists = preparedArtists.slice(0, limit);

			return preparedArtists;
		},
		isHaveRussianChars: function(string)
		{
			return string.search(/[А-яЁё]/) != -1;
		},
		isFeatArtist: function(string)
		{
			return string.search(/feat./) != -1 ||
				string.search(/ft./) != -1 ||
				string.search(/Feat./) != -1 ||
				string.search(/&/) != -1;
		},
		isHaveForbiddenChars: function(string)
		{
			return string.search(/♫/) != -1 ||
				string.search(/ - /) != -1;
		},
		isForbiddenArtist: function(artist)
		{
			return (artist == 'Noize MC') ||
				(artist == 'Anacondaz');
		},
		removeDuplicateSpaces: function(string)
		{
			string = string.replace(/[ \t]{2,}/g, ' ');
			string = string.replace(/^\s+/, '');
			string = string.replace(/\s+$/, '');

			return string;
		}
	});

	AudioModel.Consts =
	{
		ARTISTS_GET_TRACKS_COUNT: 150,
		ARTISTS_COUNT_RESERVE_FACTOR: 2
	};

	//-------------------- static ---------------------------

	AudioModel.Get = function(options)
	{
		this.instance = this.instance || new AudioModel(options);

		return this.instance;
	};

	return AudioModel;
});
