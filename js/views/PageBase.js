define([
	'models/Views',
	'views/Base',
	'views/Footer',
	'text!html/pageBase.html'
], function(ViewsModel, BaseView, FooterView, pageTemplate)
{
	var BasePageView = BaseView.extend(
	{
		elClass: 'pagebase',
		getTitle: function()
		{
		},
		el: $('body'),
		init: function()
		{
			BaseView.prototype.init.call(this);

			ViewsModel.Get().setPage(this);
		},
		render: function()
		{
			this.views = {};

			this.init();
			this.createViews();
			this.$el.html(this.getHtml());
			this.load();
		},
		createViews: function()
		{
			this.addContentView();
			this.addView(FooterView, 'footer');
		},
		_getHtml: function()
		{
			return _.template(pageTemplate,
			{
				contentHtml: this.getContentHtml(),
				footerHtml: this.views.footer.getHtml(),
				loader: this.loader
			});
		},
		load: function()
		{
			BaseView.prototype.load.call(this);

			this.prepareHeight();
		},
		registerNativeHandlers: function()
		{
			var self = this;

			$(window).on('resize', function()
			{
				self.prepareHeight();
			});
		},

		//--------------------- utility -----------------------------

		addContentView: function()
		{
			return this.addView(this.getContentConstr(), 'content', this.params);
		},
		getContentHtml: function()
		{
			return this.views.content.getHtml();
		},
		hideLoader: function()
		{
			$('.pagebase-loader').hide();
		},

		//---------------- handlers --------------------

		prepareHeight: function()
		{
			$('#content').css('min-height', ($(window).outerHeight(true) -
				this.views.footer.$el.outerHeight(true)) + 'px');
		}
	});

	return BasePageView;
});
