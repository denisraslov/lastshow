
define([
	'models/User',
	'models/LastFM'
], function(UserModel, LastFMModel)
{
	var AppRouter = Backbone.Router.extend(
	{
		pages:
		[
			'login',
			'artists',
			'artist'
		],
		init: function()
		{
			var params = this.parseUrl();

			this.navigate(params.p, params);
		},
		parseUrl: function(url)
		{
			var url = new purl(url || location.href);
			var params = url.param();

			if (!params.p || this.pages.indexOf(params.p) == -1)
			{
				params = this.getDefaultPageParams();
			}

			return params;
		},
		getDefaultPageParams: function()
		{
			return { p: 'artists' };
		},
		navigate: function(page, params)
		{
			params = params || {};

			params.p = page;
			params.t = (new Date()).getTime().toString().substr(0, 9);

			window.history.pushState({}, '', '/?' + this.getParamsString(params));

			this.renderPage(params);
		},
		getParamsString: function(params)
		{
			var string = '';

			for (var prop in params)
			{
				if (prop != 'token')
				{
					string += prop + '=' + encodeURIComponent(params[prop]) + '&';
				}
			}

			string = string.substr(0, string.length - 1);

			return string;
		},
		renderPage: function(params)
		{
			var self = this;
			var isUserLogined = UserModel.Get().isLogined;
			var page = params.p;
			var currentUrl;

			delete params.p;

			if (page != 'login' && !isUserLogined)
			{
				currentUrl = this.getParamsString(this.parseUrl());

				params = { redirect: encodeURIComponent(currentUrl) };

				this.navigate('login', params);
			}
			else if (page == 'login' && isUserLogined)
			{
				params = this.getDefaultPageParams();

				this.navigate(params.p, params);
			}
			else
			{
				LastFMModel.Get().prepareSession(params, function()
				{
					require(['views/Page' + _.str.capitalize(page)], function(pageViewClass)
					{
						var pageView = new pageViewClass();

						pageView.params = params;
						pageView.render();
						self.prepareTitle(pageView);
					});
				});
			}
		},
		prepareTitle: function(pageView)
		{
			var title = pageView.getTitle();

			title = 'LastShow — почувствуй шоу любимой группы' +
				(title ? ' | ' + title : '');

			$('title').html(title);
		}
	});

	var router = {};

	router.init = function()
	{
		UserModel.Get().checkAuth(function()
		{
			router.instance = new AppRouter();
			router.instance.init();
		});
	};

	router.Consts =
	{
		URL: 'http://lastshow.net'
	};

	return router;
});
