define([
], function()
{
	var BaseView = Backbone.View.extend(
	{
		elClass: 'base',
		createViews: function()
		{
		},
		addView: function(viewConstr, name, params)
		{
			var view = new viewConstr();

			view.name = name;
			view.parent = this;
			view.params = params || {};
			view.init();
			view.createViews();

			this.views[name] = view;

			return view;
		},
		init: function()
		{
			this.views = {};
			this.handlers = {};
		},
		getHtml: function()
		{
			this.elementId = this.generateElementId(++BaseView.createdCount);
			this.$el = $(this._getHtml());
			this.$el.attr('id', this.elementId);
			this.$el.addClass(this.getClasses());

			return this.$el[0].outerHTML;
		},
		load: function()
		{
			this.$el = $('#' + this.elementId);
			this.registerNativeHandlers();

			this.processViews(function(view)
			{
				view.load();
			});
		},
		remove: function()
		{
			this.$el.remove();
		},

		//-------------------- native handlers -------------------------

		registerNativeHandlers: function()
		{
			var self = this;
			var events = this.events || {};
			var selector;
			var eventName;
			var element;
			var handlerMethodName;

			for (var eventId in events)
			{
				selector = this.getSelectorFromNativeEventId(eventId);
				eventName = this.getNameFromNativeEventId(eventId);
				element = selector ? $(selector, this.$el) : this.$el;
				handlerMethodName = events[eventId];

				(function(handlerMethodName)
				{
					element.on(eventName, function(event)
					{
						var result = self[handlerMethodName]($(this), event);

						return result == false ? false : true;
					});
				})(handlerMethodName);
			}
		},
		getNameFromNativeEventId: function(id)
		{
			return id.split(' ')[0];
		},
		getSelectorFromNativeEventId: function(id)
		{
			var idParts = id.split(' ');

			idParts.shift();

			return idParts.join(' ');
		},

		//--------------------- handlers --------------------------

		registerHandler: function(eventName, viewName, handlerMethodName)
		{
			this.handlers[viewName] = this.handlers[viewName] || {};
			this.handlers[viewName][eventName] = handlerMethodName;
		},
		trigger: function(eventName, params)
		{
			var parent = this.parent;
			var handlerMethodName;

			params = params || [];

			if (parent && parent.handlers[this.name] &&
				(handlerMethodName = parent.handlers[this.name][eventName]))
			{
				params.unshift(this);
				parent[handlerMethodName].apply(parent, params);
			}
		},

		//---------------- popup ----------------------------------

		showPopup: function(popupConstr, params)
		{
			var popupView = this.addView(popupConstr, 'popup', params);

			this.$el.append(popupView.getHtml());
			popupView.load();
		},

		//------------------ utility ---------------------------

		processViews: function(procFunc)
		{
			var views = this.views || {};

			for (var name in views)
			{
				procFunc(views[name]);
			}
		},
		generateElementId: function(number)
		{
			return 'view' + number;
		},
		/*
		loadCss: function()
		{
			var view = this;

			while (!view.constructor.isCSSLoaded && view.constructor != Backbone.View)
			{
				$('head').append('<link rel="stylesheet" href="css/' + view.cssFileName  + '.css">');
				view.constructor.isCSSLoaded = true;
				view = view.constructor.__super__;
			}
		}
		*/
		getClasses: function()
		{
			var view = this;
			var classes = '';

			while (view.constructor != Backbone.View)
			{
				classes += view.elClass + ' ';
				view = view.constructor.__super__;
			}

			return classes;
		}
	});

	BaseView.createdCount = 0;

	return BaseView;
});
