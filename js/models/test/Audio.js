
define([
	'chai',
	'sinonChai',
	'models/Audio'
], function(chai, sinonChai, AudioModel)
{
	var should = chai.should();
	var expect = chai.expect;

	return {
		init: function()
		{
			describe('Audio Model', function()
			{
				it('It\'s singleton', function()
				{
					should.equal(AudioModel.Get(), AudioModel.Get());
				});

				it('isHaveRussianChars 1', function()
				{
					should.equal(AudioModel.Get().isHaveRussianChars('Green Day'), false);
				});

				it('isHaveRussianChars 2', function()
				{
					should.equal(AudioModel.Get().isHaveRussianChars('Стрыкало'), true);
				});
			});
		}
	};
});
