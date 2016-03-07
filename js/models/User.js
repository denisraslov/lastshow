define([
	'models/VK'
], function(VKModel)
{
	var UserModel = Backbone.Model.extend(
	{
		checkAuth: function(callback)
		{
			var self = this;
			
			VK.Auth.getLoginStatus(function(data)
			{
				self.checkAuthData(data, function(result)
				{
					self.isLogined = result;
					callback();
				})
			});
		},
		checkAuthData: function(data, callback)
		{
			if (data.session)
			{
				VK.api('getUserSettings', {}, function(data)
				{
					callback(data.response == 8);
				});
			}
			else
			{
				callback(false);
			}
		},
		login: function(callback)
		{
			var self = this;

			newCallback = function(result)
			{
				self.isLogined = result;
				callback(result)
			};

			VK.Auth.login(function(data)
			{
				self.checkAuthData(data, newCallback)
			}, 8);
		},
		logout: function(callback)
		{
			var self = this;

			var newCallback = function()
			{
				self.isLogined = false;
				callback();
			};

			VKModel.Get().logout(newCallback);
		}
	});

	UserModel.Get = function(options)
	{
		this.instance = this.instance || new UserModel(options);
		
		return this.instance;
	};

	return UserModel;
});
