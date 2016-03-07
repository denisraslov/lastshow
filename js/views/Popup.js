define([
	'views/Base',
	'text!html/popup.html'
], function(BaseView, template)
{
	var PopupView = BaseView.extend(
	{
		elClass: 'popup',
		createViews: function()
		{
			this.addContentView();
		},
		_getHtml: function()
		{
			var params = this.params;

			return _.template(template)(
			{
				contentHtml: this.views.content.getHtml()
			});
		},
		load: function()
		{
			BaseView.prototype.load.call(this);

			this.$el.find('.popup-content').position(
			{
				of: $(window),
				my: 'center center',
				at: 'center center'
			});
		}
	});

	return PopupView;
});
