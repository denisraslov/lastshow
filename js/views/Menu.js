define([
	'router',
	'views/Base',
	'views/MenuItem',
	'models/User',
	'models/LastFM',
	'models/VK',
	'text!html/menu.html',
], function(Router, BaseView, MenuItemView, UserModel, LastFMModel, VKModel, template)
{
	var MenuView = BaseView.extend(
	{
		elClass: 'menu',
		events:
		{
			'click .menu-logout': 'logout',
			'click .menu-live-switcher': 'switchLiveMode'
		},
		init: function()
		{
			BaseView.prototype.init.call(this);

			this.items = [];
		},
		createViews: function()
		{
			/*
			this.addItem(
			{
				value: VKModel.Get().isLiveMode() ? 'Записи' : 'Лайвы',
				handlerClass: 'menu-live-switcher'
			});
			*/
			this.addLastFMItem();
			this.addItem(
			{
				value: 'Выйти',
				handlerClass: 'menu-logout'
			});
		},
		_getHtml: function()
		{
			return _.template(template)(
			{
				itemsHtml: this.getItemsHtml()
			});
		},

		//------------------------ utility ---------------------------

		addItem: function(params)
		{
			var item = this.addView(MenuItemView, 'item' + this.items.length, params);

			this.items.push(item);
		},
		getItemsHtml: function()
		{
			var items = this.items;
			var html = '';

			for (var i = 0; i < items.length; i++)
			{
				html += items[i].getHtml();
			}

			return html;
		},
		addLastFMItem: function()
		{
			var lastFMModel = LastFMModel.Get();
			var lastFMIconHtml = this.getLastFMIconHtml();
			var userName = lastFMModel.getUserName();
			var params = {};

			if (userName)
			{
				params.value = lastFMIconHtml + userName;
				params.href = lastFMModel.getUserUrl();
				params.blank = true;
			}
			else
			{
				params.value = lastFMIconHtml + 'Скробблить в Last.fm ';
				params.href = lastFMModel.getAuthUrl();
			}

			this.addItem(params);
		},
		getLastFMIconHtml: function()
		{
			return'<img src="http://cdn.last.fm/flatness/favicon.2.ico" class="menu-lastfmicon">';
		},

		//----------------------- hanlders -----------------------------

		logout: function()
		{
			UserModel.Get().logout(function()
			{
				Router.instance.navigate('login');
			});
		},
		switchLiveMode: function()
		{
			localStorage.setItem('liveMode', VKModel.Get().isLiveMode() ? 0 : 1);

			location.reload();
		}
	});

	return MenuView;
});
