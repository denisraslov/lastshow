define([
	'views/Base',
	'text!html/tour.html'
], function(BaseView, template)
{
	var TourView = BaseView.extend(
	{
		elClass: 'tour',
		events:
		{
			'hover .tour-content': 'showInfo'
		},
		init: function()
		{
			var params = this.params;
			var interval = params.interval;

			BaseView.prototype.init.call(this);

			params.start.date(1);
			interval.start.date(1);
			interval.finish.date(1);

			console.log(interval.finish.diff(interval.start, 'month') + 1);
			console.log(interval.start.diff(params.start, 'month'));

			this.width = (interval.finish.diff(interval.start, 'month') + 1) * TourView.Consts.MONTH_WIDTH;
			this.coord = interval.start.diff(params.start, 'month') * TourView.Consts.MONTH_WIDTH;
		},
		_getHtml: function()
		{
			return _.template(template)(
			{
				width: this.width,
				coord: this.coord,
				title: this.params.title
			});
		},

		//------------------------------- handlers ----------------------------

		showInfo: function()
		{
			var params = this.params;

			this.$el.toolbar({
				content: params.title,
				position: 'top'
			});
		}
	});

	//--------------------- const ----------------------

	TourView.Consts =
	{
		MONTH_WIDTH: 8,
		HEIGHT: 18
	};

	return TourView;
});
