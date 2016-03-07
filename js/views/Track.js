define([
	'views/Base',
    'text!html/track.html'
], function(BaseView, template)
{
	var TrackView = BaseView.extend(
	{
		elClass: 'track',
		events:
		{
			'click': 'onClick'
		},
		_getHtml: function()
		{
			return _.template(template)(this.params);
		},
		load: function()
		{
			var el;
			var innerDivs;

			BaseView.prototype.load.call(this);

			el = this.$el;
			innerDivs = el.find('div');

			innerDivs.css('visibility', 'hidden');
			el.hide();

			if (this.params.url)
			{
				el.show({ effect: 'slider', complete: function()
				{
					innerDivs.css('visibility', 'visible');
				}
				});
			}
		},

		//------------------- handlers ----------------------

		onClick: function()
		{
			this.trigger('OnPlay');
		},

		//------------------- utility -------------------------

		play: function()
		{
			this.active = true;
			this.$el.addClass('track-active');
		},
		stop: function()
		{
			this.$el.removeClass('track-active');
			this.active = false;
		},

		//-------------------- loader ----------------------------

		showLoader: function()
		{
			this.getLoader().show();
		},
		hideLoader: function()
		{
			this.getLoader().hide();
		},
		getLoader: function()
		{
			return this.$el.find('.track-loader');
		}
	});

	return TrackView;
});
