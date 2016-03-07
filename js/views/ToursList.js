define([
	'views/Base',
	'views/ToursListItem',
	'models/Audio',
	'text!html/toursList.html'
], function(BaseView, ToursListItemView, AudioModel, template)
{
	var ToursListView = BaseView.extend(
	{
		elClass: 'tourslist',
		_getHtml: function()
		{
			return template;
		},
		load: function()
		{
			var self = this;

			BaseView.prototype.load.call(this);

			AudioModel.Get().getArtistTours(this.params.artist, function(tours)
			{
				if (tours.length > 0)
				{
					self.showTitle();
				}
				self.hideLoader();
				self.addViews(tours);
			});
		},

		//---------------------- utility -----------------------

		addViews: function(tours)
		{
			var params = this.params;
			var tour;
			var wrap = this.$el.find('.tourslist-content');
			var view;

			for (var i = 0; i < tours.length; i++)
			{
				tour = tours[i];

				tour.artist = params.artist;
				tour.showsCaption = (i == 0);
				tour.active = (params.activeTour == tour.title);

				view = this.addView(ToursListItemView, 'tour' + i, tour);
				wrap.append(view.getHtml());
				view.load();
			}

			this.trigger('OnLoaded');
		},
		hideLoader: function()
		{
			var $el = this.$el;

			$el.find('.tourslist-loader').hide();
		},
		showTitle: function()
		{
			var $el = this.$el;

			$el.find('.utility-sectiontitle').show();
		}
	});

	//--------------- consts --------------------

	ToursListView.Consts =
	{
	};

	return ToursListView;
});
