define([
	'views/Base',
	'views/Show',
	'models/Audio',
    'text!html/artist.html'
], function(BaseView, ShowView, AudioModel, template)
{
	var ArtistView = BaseView.extend(
	{
		elClass: 'artist',
		createViews: function()
		{
			var show = this.params.show;

			if (show)
			{
				this.addView(ShowView, 'show', show);
			}
		},
		_getHtml: function()
		{
			var params = this.params;
			var show = this.views.show;

			return _.template(template)(
			{
				id: params.id,
				isLink: params.isLink,
				additionHtml: show ? show.getHtml() : ''
			});
		},
		load: function()
		{
			BaseView.prototype.load.call(this);

			this.prepareImg();
		},

		//--------------------- utility ----------------------------

		prepareImg: function()
		{
			var self = this;
			var imgEl;

			imgEl = this.$el.find('.artist-img');
			imgEl.hide();
			AudioModel.Get().getArtistImg(this.params.id, function(img)
			{
				self.$el.find('.artist-loader').hide();
				imgEl.attr('src', img.big);
				imgEl.show();
			});
		}
	});

	return ArtistView;
});
