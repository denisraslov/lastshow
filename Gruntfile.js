module.exports = function(grunt)
{
	var _ = require('underscore.string');

	// Project configuration.
	grunt.initConfig(
	{
		pkg: grunt.file.readJSON('package.json'),
		less:
		{
			compile:
			{
				files:
				{
					'css/compiled.css': ['css/*.less']
				}
			}
		},
		cssmin:
		{
			combine:
			{
				files:
				{
					'css/compiled.min.css': ['css/compiled.css']
				}
			}
		},
		ftpush:
		{
			build:
			{
				auth:
				{
					host: 'lastshow.net',
					port: 21,
					authKey: 'key1'
				},
				src: '',
				dest: 'www/lastshow.net',
				simple: true,
				exclusions: ['.grunt', '.idea', 'node_modules', 'Gruntfile.js', 'app.swf', 'player.html', 'css/*.less']
				//keep: ['/important/images/at/server/*.jpg']
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-less');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-ftpush');

	grunt.registerTask('cssdelete', 'LastShow Delete Css Task', function()
	{
		var fs = require('fs');

		fs.unlink('css/compiled.css', function (err)
		{
			if (err) throw err;
		});
	});

	//----------------------- default tasks ------------------------------

	grunt.registerTask('default', ['cssdelete', 'less']);

	//----------------------- other tasks ------------------------------

	grunt.registerTask('new-view', 'LastShow New View Task', function()
	{
		var viewName = grunt.option('new-view-name');
		var fs = require('fs');

		fs.openSync('js/views/' + _.capitalize(viewName) + '.js', 'w');
		fs.openSync('html/' + viewName + '.html', 'w');
		fs.openSync('css/' + viewName + '.css', 'w')
	});
};
