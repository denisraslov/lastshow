define([
	'views/Popup',
	'views/PopupContentVKCaptcha'
], function(PopupView, VKCaptchaPopupContentView)
{
	var VKCaptchaPopupView = PopupView.extend(
	{
		elClass: 'popupvkcaptcha',

		//-------------------------- utility ----------------------------

		addContentView: function()
		{
			this.addView(VKCaptchaPopupContentView, 'content', this.params);
		}
	});

	return VKCaptchaPopupView;
});
