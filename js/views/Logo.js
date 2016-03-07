define([
	'views/Base',
    'text!html/logo.html'
], function(BaseView, template)
{
	var LogoView = BaseView.extend(
	{
		elClass: 'logo',
		_getHtml: function()
		{
			return template;
		}

		//------------------ utility ----------------------

	});

	return LogoView;
});
