var mandrill = require('node-mandrill');
var config = require('../../config');

function sendTemplate(emails, template, merge, callback) {
	if (!config.mandrill.token) {
		return callback('no mandrill token. ok for development mode, fail for production mode');
	}

	var api = mandrill(config.mandrill.token);

	return api('/messages/send-template', {
		template_name: template,
		template_content: [],
		message: {
			auto_html: false,
			to: emails,
			bcc_address: 'devs@likeastore.com',
			global_merge_vars: merge
		}
	}, callback);
}

module.exports = {
	sendTemplate: sendTemplate
};