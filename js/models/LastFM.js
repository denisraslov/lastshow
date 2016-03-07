define([
	'utility/MD5'
], function(MD5Utility)
{
	var LastFMModel = Backbone.Model.extend(
	{
		//--------------------- methods ------------------------------------

		getTopArtists: function(limit, callback)
		{
			var self = this;

			this.sendRequest(
			{
				method: 'chart.gettopartists',
				limit: limit
			},
			function(data)
			{
				var artists =  $('artist', data);
				var artistNames = [];

				for (var i = 0; i < artists.length; i++)
				{
					artistNames.push(self.getNodeValue(artists[i], 'name'));
				}

				callback(artistNames);
			});
		},
		getArtists: function(value, limit, callback)
		{
			var self = this;

			this.sendRequest(
			{
				method: 'artist.search',
				artist: value,
				limit: limit
			},
			function(data)
			{
				var artists =  $('artist', data);
				var artistNames = [];

				for (var i = 0; i < artists.length; i++)
				{
					artistNames.push(self.getNodeValue(artists[i], 'name'));
				}

				callback(artistNames);
			});
		},
		getSimilarArtists: function(value, limit, callback)
		{
			var self = this;

			this.sendRequest(
			{
				method: 'artist.getsimilar',
				artist: value,
				limit: limit
			},
			function(data)
			{
				var artists =  $('artist', data);
				var artistNames = [];

				for (var i = 0; i < artists.length; i++)
				{
					artistNames.push(self.getNodeValue(artists[i], 'name'));
				}

				callback(artistNames);
			});
		},
		getArtistImg: function(artist, callback)
		{
			var self = this;

			this.sendRequest(
			{
				method: 'artist.getinfo',
				artist: artist
			},
			function(data)
			{
				data = $(data);

				callback(
				{
					small: self.getNodeValue(data, 'image[size="large"]'),
					big: self.getNodeValue(data, 'image[size="mega"]')
				});
			});
		},

		//-------------------- methods with auth -------------------------

		updateStatus: function(artist, title, callback)
		{
			this.sendRequest(
			{
				method: 'track.updateNowPlaying',
				artist: artist,
				track: title,
				auth: true
			},
			function(data)
			{
				callback();
			});
		},
		scrobbleTrack: function(artist, title, callback)
		{
			this.sendRequest(
			{
				method: 'track.scrobble',
				artist: artist,
				track: title,
				timestamp: Math.round((new Date()).getTime() / 1000),
				auth: true
			},
			function(data)
			{
				callback();
			});
		},

		//------------------------ auth --------------------------------

		getAuthUrl: function()
		{
			return 'http://www.last.fm/api/auth/?api_key=' + LastFMModel.Consts.API_KEY + '&cb=' + encodeURIComponent(location.href);
		},
		prepareSession: function(getParams, callback)
		{
			var token = getParams.token;

			delete getParams.token;

			this.session = {};

			if (token)
			{
				this.getSession(token, callback);
			}
			else
			{
				this.session.key = localStorage.getItem('lastFMKey');
				this.session.name = localStorage.getItem('lastFMUser');

				callback();
			}
		},
		getSession: function(token, callback)
		{
			var self = this;

			this.sendRequest(
			{
				method: 'auth.getSession',
				token: token
			},
			function(data)
			{
				data = $(data);

				self.session.key = self.getNodeValue(data, 'key');
				self.session.name = self.getNodeValue(data, 'name');

				localStorage.setItem('lastFMKey', self.session.key);
				localStorage.setItem('lastFMUser', self.session.name);

				callback();
			});
		},
		getUserName: function()
		{
			return this.session.name;
		},
		getUserUrl: function()
		{
			var userName = this.getUserName();

			return userName ? 'http://www.last.fm/user/' + userName : '';
		},

		//------------------------ utility ------------------------------

		sendRequest: function(params, callback)
		{
			if (!params.auth || this.getUserName())
			{
				$.ajax({
					type: params.auth ? 'POST' : 'GET',
					url: this.getAPIUri(params),
					success: callback
				});
			}
			else
			{
				callback();
			}
		},
		getAPIUri: function(params)
		{
			var uri = '';

			params.api_key = LastFMModel.Consts.API_KEY;
			if (params.token || params.auth)
			{
				delete params.auth;
				if (this.session.key)
				{
					params.sk = this.session.key;
				}
				params.api_sig = this.getSign(params);
			}

			for (var paramName in params)
			{
				if (uri != '')
				{
					uri += '&';
				}
				uri += paramName + '=' + escape(params[paramName]);
			}

			uri = LastFMModel.Consts.URL + '?' + uri;

			return uri;
		},
		getSign: function(params)
		{
			var result = '';
			var keys;
			var key;

			keys = _(params).map(function(value, key)
			{
				return key;
			});
			keys.sort();

			for (var i = 0; i < keys.length; i++)
			{
				key = keys[i];
				result += key + params[key];
			}

			return MD5Utility.calculate(result + LastFMModel.Consts.API_SECRET);
		},
		getNodeValue: function(node, tagName)
		{
			return $(tagName, node)[0].childNodes[0].nodeValue;
		}
	});

	//---------------------- const ---------------------------

	LastFMModel.Consts =
	{
		URL: 'http://ws.audioscrobbler.com/2.0/',
		API_KEY: '87436ee5f52c9c29bc57cb489660f149',
			//'f4e125b2c02d3dbb37b8976c31cf48bf',
		API_SECRET: '34d79384decca37700090e34e49e166f'
			//'079e4d233023e2ebad032ee82eb1bad8'
	};

	//-------------------- static ---------------------------

	LastFMModel.Get = function(options)
	{
		this.instance = this.instance || new LastFMModel(options);
		
		return this.instance;
	};

	return LastFMModel;
});
