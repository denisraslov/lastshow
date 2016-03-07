define([
], function()
{
	var ViewsModel = Backbone.Model.extend(
	{
		setPage: function(view)
		{
			this.page = view;
		},
		getPage: function()
		{
			return this.page;
		}
	});

	ViewsModel.Get = function(options)
	{
		this.instance = this.instance || new ViewsModel(options);
		
		return this.instance;
	};

	return ViewsModel;
});
