define([
	'views/PageBase',
	'views/Header',
], function(BasePageView, HeaderView)
{
	var SystemPageView = BasePageView.extend(
	{
		elClass: 'pagesystem',
		loader: true,
		createViews: function()
		{
			BasePageView.prototype.createViews.call(this);

			this.addHeaderView();
		},
		getContentHtml: function()
		{
			return this.views.header.getHtml() +
				BasePageView.prototype.getContentHtml.call(this);
		},

		//-------------------- utility ----------------------

		addHeaderView: function()
		{
			this.addView(HeaderView, 'header');
		}
	});

	return SystemPageView;
});
