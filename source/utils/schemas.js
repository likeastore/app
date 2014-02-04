/* Few common schemas for user login and setup */
var schema = require('json-schema');
var emailRegex = /^[\w\.\+\-_%]+@(?:[\w\-]+\.)+[A-Za-z]{2,6}$/i;

exports.schemas = {
	collection: {
		description: 'Collection of likes',
		type: 'object',
		properties: {
			title: {
				required: true,
				type: 'string'
			},
			public: {
				required: false,
				type: 'boolean'
			},
			description: {
				required: false,
				type: 'string'
			}
		}
	}
};

exports.validate = function (json, model, callback) {
	var result = schema.validate(json, this.schemas[model]);
	if (!result.valid) {
		return callback({ message: 'Error validating against schema', error: result.errors });
	}
	return callback(null);
};
