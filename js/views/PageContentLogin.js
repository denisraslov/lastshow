define([
	'router',
	'views/Base',
	'views/Logo',
	'models/User',
	'models/VK',
	'models/Audio',
	'text!html/pageContentLogin.html',
	'text!html/pageContentLoginHint.html'
], function(Router, BaseView, LogoView, UserModel, VKModel, AudioModel, template, hintTemplate)
{
	var LoginPageContentView = BaseView.extend(
	{
		elClass: 'pagecontentlogin',
		events:
		{
			'click #login-button': 'login'
		},
		createViews: function()
		{
			BaseView.prototype.createViews.call(this);

			this.addView(LogoView, 'logo');
		},
		_getHtml: function()
		{
			return _.template(template)(
			{
				logoHtml: this.views.logo.getHtml()
			});
		},
		load: function()
		{
			BaseView.prototype.load.call(this);

			VKModel.Get().initLoginButton('login-button');

			this.prepareSlider();
			this.showArtistHint();
		},

		//--------------------- utility ----------------------

		prepareSlider: function()
		{
			this.$el.find('.pagecontentlogin-slider').bxSlider(
			{
				auto: true,
				pause: LoginPageContentView.Consts.SLIDER_PAUSE_TIME
			});
		},
		showArtistHint: function()
		{
			var params;
			var artist;

			params = this.getRedirectParams();

			if (params.p == 'artist' && (artist = params.id))
			{
				AudioModel.Get().getArtistImg(artist, function(img)
				{
					setTimeout(function()
					{
						$('#login-button').toolbar({
							content: _.template(hintTemplate)(
							{
								artist: artist,
								img: img.small,
								tour: params.tour
							}),
							position: 'bottom'
						});
					}, 800);
				});
			}
		},
		getRedirectParams: function()
		{
			return Router.instance.parseUrl(Router.Consts.URL + '/?' + decodeURIComponent(this.params.redirect));
		},

		//--------------------handlers-----------------------

		login: function()
		{
			var self = this;

			UserModel.Get().login(function(result)
			{
				var params;

				if (result)
				{
					params = self.getRedirectParams();

					Router.instance.navigate(params.p, params);
				}
			});
		}
	});

	//------------------ consts -----------------------

	LoginPageContentView.Consts =
	{
		SLIDER_PAUSE_TIME: 5000
	};

	return LoginPageContentView;
});
