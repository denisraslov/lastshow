define([
	'models/Views',
	'views/PopupVKCaptcha'
], function(ViewsModel, VKCaptchaPopupView)
{
	var VKModel = Backbone.Model.extend(
	{
		init: function()
		{
			VK.init(
			{
				apiId: VKModel.Consts.API_KEY
			});
		},
		logout: function(callback)
		{
			VK.Auth.logout(callback);
		},
		initLoginButton: function(buttonId)
		{
			VK.UI.button(buttonId);
		},

		//-------------------- captcha --------------------------

		captcha: {},
		setCaptchaKey: function(key)
		{
			this.captcha.key = key;
		},
		sendLastRequest: function()
		{
			var request = this.request;

			this.sendAPIRequest(request.method, request.params, request.callback, request.dataPreparer);
		},

		//------------------- utility --------------------------

		prepareAPIParams: function(params)
		{
			params.captcha_sid = this.captcha.id;
			params.captcha_key = this.captcha.key;
		},
		handleAPIResponse: function(data, callback, dataPreparer)
		{
			if (data.error && data.error.error_code == 14)
			{
				this.captcha.id = data.error.captcha_sid;

				ViewsModel.Get().getPage().showPopup(VKCaptchaPopupView,
				{
					img: data.error.captcha_img,
					VKModelInstance: this
				});
			}
			else
			{
				dataPreparer = dataPreparer || function(data){return data;};
				callback(dataPreparer(data.response));
			}
		},
		sendAPIRequest: function(method, params, callback, dataPreparer)
		{
			var self = this;

			this.prepareAPIParams(params);

			this.request = {};
			this.request.method = method;
			this.request.params = params;
			this.request.callback = callback;
			this.request.dataPreparer = dataPreparer;

			VK.api(
				method,
				params,
				function(data)
				{
					self.handleAPIResponse(data, callback, dataPreparer);
				});
		},

		//------------------------ methods ---------------------------

		getUserTracks: function(limit, callback)
		{
			var params = { count: limit };

			this.sendAPIRequest('audio.get', params, callback);
		},
		getTrackUrl: function(artist, track, callback)
		{
			//var liveCheckbox = $('.live-checkbox');
			//var params = { q: artist + ' ' + track + (liveCheckbox[0].checked == 1 ? ' live' : ''), count: 10  };

			var params =
			{
				q: artist + ' ' + track, // + (this.isLiveMode() ? ' live' : ''),
				count: VKModel.Consts.GET_TRACK_COUNT
			};

			var dataPreparer = function(data)
			{
				return data[1] ? data[1].url : undefined;
			};

			this.sendAPIRequest('audio.search', params, callback, dataPreparer);
		},
		isLiveMode: function()
		{
			return Number(localStorage.getItem('liveMode'));
		}
	});

	//---------------------- const ---------------------------

	VKModel.Consts =
	{
		API_KEY: '3679724',
		// '4035738',
		GET_TRACK_COUNT:    10
	};

	//-------------------- static ---------------------------

	VKModel.Get = function(options)
	{
		this.instance = this.instance || new VKModel(options);

		return this.instance;
	};

	return VKModel;
});
