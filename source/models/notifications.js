var config = require('../../config');
var logger = require('../utils/logger');
var mandrill = require('node-mandrill')(config.mandrill.token);

function followed(user, followedUser, callback) {
	mandrill('/messages/send-template', {
		template_name: 'user-followed',
		template_content: [],
		message: {
			auto_html: null,
			to: [{email: followedUser.email}],
			global_merge_vars: [{
				name: 'username',
				content: user.displayName || user.name || user.username
			}, {
				name: 'avatar',
				content: user.avatar
			}],
			preserve_recipients: false
		},
	}, function (err) {
		if (err) {
			logger.error({message: 'error during mandrill send (user-followed)', err: err});
		}

		callback && callback(err);
	});
}

module.exports = {
	followed: followed
};
