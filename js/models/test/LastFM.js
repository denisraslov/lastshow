
define([
	'chai',
	'sinonChai',
	'models/LastFM'
], function(chai, sinonChai, LastFMModel)
{
	var should = chai.should();

	return {
		init: function()
		{
			describe('Models', function()
			{
				it('LastFM Model is singleton', function()
				{
					should.equal(LastFMModel.Get(), LastFMModel.Get());
				});

				it('LastFM: getTopArtists limit is normal', function()
				{
					var limit = 10;

					LastFMModel.Get().getTopArtists(limit, function(artists)
					{
						should.equal(limit, artists.length);
					});
				});

				it('LastFM: getSimilarArtists limit is normal', function()
				{
					var limit = 10;

					LastFMModel.Get().getSimilarArtists('Green Day', limit, function(artists)
					{
						should.equal(limit, artists.length);
					});
				});
			});
		}
	};
});
