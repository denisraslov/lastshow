define([
	'views/PageBase',
	'views/PageContentLogin'
], function(BasePageView, LoginPageContentView)
{
	var LoginPageView = BasePageView.extend(
	{
		elClass: 'pagelogin',
		getContentConstr: function()
		{
			return LoginPageContentView;
		},
		prepareHeight: function()
		{
			BasePageView.prototype.prepareHeight.call(this);

			this.views.content.$el.position(
			{
				of: this.$el.find('.content'),
				at: 'center center',
				my: 'center center',
				offset: '0 0'
			});
		}
	});

	return LoginPageView;
});
