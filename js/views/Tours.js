define([
	'views/Base',
	'views/Tour',
	'models/SetlistFM',
	'text!html/tours.html'
], function(BaseView, TourView, SetlistFMModel, template)
{
	var ToursView = BaseView.extend(
	{
		elClass: 'tours',
		_getHtml: function()
		{
			return template;
		},
		load: function()
		{
			var self = this;

			BaseView.prototype.load.call(this);

			SetlistFMModel.Get().getArtistTours(this.params.artist, function(tours)
			{
				self.drawMonthes(tours);
				self.addToursViews(tours);
			});
		},

		//---------------------- utility -----------------------

		drawMonthes: function(tours)
		{
			var start = tours[0].interval.start;
			var monthesCount = moment().diff(start, 'month');
			var $el = this.$el;
			var gridRowEl = $el.find('.tours-grid-row');

			$el.find('.tours-content-wrap').css('width', (monthesCount * TourView.Consts.MONTH_WIDTH) + 'px');
			gridRowEl.css('height', (tours.length * TourView.Consts.HEIGHT) + 'px');
			gridRowEl.html(this.getMonthesHtml(start, monthesCount));
		},
		getMonthesHtml: function(start, monthesCount)
		{
			var currentMoment;
			var isFirstYearMonth;
			var html = '';

			currentMoment = moment(start);
			for (var i = 0; i < monthesCount; i++)
			{
				currentMoment.add(1, 'month');
				isFirstYearMonth = (currentMoment.month() == 0);

				html += '<div class="tours-month';

				if (isFirstYearMonth)
				{
					html += ' tours-month-yearfirst';
				}

				html += '">';

				if (isFirstYearMonth)
				{
					html += '<div class="tours-month-year-wrap"><div class="tours-month-year">' +
						currentMoment.year() + '</div></div>';
				}

				html += '</div>';
			}

			return html;
		},
		addToursViews: function(tours)
		{
			var tour;
			var wrap = this.$el.find('.tours-items');
			var view;

			for (var i = 0; i < tours.length; i++)
			{
				tour = tours[i];
				tour.start = tours[0].interval.start;

				view = this.addView(TourView, 'tour' + i, tour);
				wrap.append(view.getHtml());
				view.load();
			}
		}
	});

	//--------------- consts --------------------

	ToursView.Consts =
	{
	};

	return ToursView;
});
