
require.config(
{
	paths:
	{
		html: '../html',
		chai: 'libs/chai/chai',
		sinonChai: 'libs/sinon-chai/sinon-chai'
	}
});

require(['chai', 'sinonChai'], function(chai, sinonChai)
{
	var should = chai.should();

	mocha.setup('bdd');

	require([
		'models/test/VK',
		'models/test/LastFM',
		'models/test/Audio'
	], function(VKModel, LastFMModel, AudioModel)
	{
		VKModel.init();
		LastFMModel.init();
		AudioModel.init();

		mocha.run();
	});

});