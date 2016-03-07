define([
	'views/Base',
    'text!html/footer.html'
], function(BaseView, template)
{
	var FooterView = BaseView.extend(
	{
		elClass: 'footer',
		_getHtml: function()
		{
			return template;
		},
		load: function()
		{
			BaseView.prototype.load.call(this);

			this.prepareVKButton();
		},

		//------------------ utility ----------------------

		prepareVKButton: function()
		{
			VK.Widgets.Like('vk-like',
			{
				pageTitle: "LastShow — почувствуй шоу любимой группы!",
				pageDescription: "Сервис, позволяющий слушать сетлисты с концертов ваших любимых исполнителей",
				pageImage: 'http://lastshow.net/img/playlist_share.jpg'
			}, 28);
		}
	});

	return FooterView;
});
