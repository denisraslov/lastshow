define([
	'router',
	'views/Base',
	'models/Audio',
    'text!html/artistInput.html'
], function(Router, BaseView, AudioModel, template)
{
	var ArtistInputView = BaseView.extend(
	{
		elClass: 'artistinput',
		events:
		{
			'keydown input': 'onKeydown'
		},
		_getHtml: function()
		{
			return _.template(template)(
			{
				value: this.params.value || ''
			});
		},
		load: function()
		{
			BaseView.prototype.load.call(this);

			this.prepareAutocomplete();
		},

		//----------------------- utility -------------------------

		prepareAutocomplete: function()
		{
			var self = this;

			$('input', this.$el).autocomplete(
			{
				source: function(request, response)
				{
					AudioModel.Get().getArtists(request.term, ArtistInputView.Consts.ARTISTS_COUNT, function(artists)
					{
						response((function()
						{
							return $.map(artists, function(artist)
							{
								return {
									label: artist,
									value: artist
								};
							})
						})()
						);
					});
				},
				select: function(event, ui)
				{
					var artist;

					if (ui.item)
					{
						artist = ui.item.label;
					}

					self.openArtist(artist);
				}
			});
		},
		openArtist: function(artist)
		{
			Router.instance.navigate('artist', { id: artist });
		},

		//------------------------- handlers -----------------------

		onKeydown: function(input, event)
		{
			var value = input.val();

			if (event.keyCode == 13 && value && value != this.params.value)
			{
				this.openArtist(value);
			}
		}
	});

	//----------------------- const -------------------------

	ArtistInputView.Consts =
	{
		ARTISTS_COUNT: 5
	};

	return ArtistInputView;
});
