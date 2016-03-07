define([
	'views/Base',
	'text!html/menuItem.html',
	'text!html/menuItemLink.html'
], function(BaseView, actionTemplate, linkTemplate)
{
	var MenuItemView = BaseView.extend(
	{
		elClass: 'menuitem',
		_getHtml: function()
		{
			var params = this.params;
			var template = params.href ? linkTemplate : actionTemplate;

			return _.template(template)(
			{
				value: params.value,
				handlerClass: params.handlerClass || '',
				href: params.href,
				blank: params.blank
			});
		}
	});

	return MenuItemView;
});
