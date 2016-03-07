define([
	'views/Base',
	'text!html/popupContentVKCaptcha.html'
], function(BaseView, template)
{
	var VKCaptchaPopupContentView = BaseView.extend(
	{
		events:
		{
			'keydown input': 'onKeydown'
		},
		elClass: 'popupcontentvkcaptcha',
		_getHtml: function()
		{
			var params = this.params;

			return _.template(template)(
			{
				img: params.img
			});
		},

		//-------------------------- handlers ----------------------------

		onKeydown: function(input, event)
		{
			var value = input.val();
			var VKModelInstance = this.params.VKModelInstance;

			if (event.keyCode == 13 && value)
			{
				VKModelInstance.setCaptchaKey(value);
				VKModelInstance.sendLastRequest();
				this.parent.remove();
			}
		}
	});

	return VKCaptchaPopupContentView;
});
