
define([
	'chai',
	'sinonChai',
	'models/VK'
], function(chai, sinonChai, VKModel)
{
	var should = chai.should();
	var expect = chai.expect;

	return {
		init: function()
		{
			describe('VK Model', function()
			{
				beforeEach(function()
				{
					VKModel.Get().init();
				});

				it('VK Model is singleton', function()
				{
					should.equal(VKModel.Get(), VKModel.Get());
				});

				it('VK Model: getUserTracks', function()
				{
					var limit = 100;

					VKModel.Get().getUserTracks(limit, function(tracks)
					{
						should.equal(tracks.length, limit);
					});
				});
			});
		}
	};
});
