/* Few common schemas for user login and setup */
var schema = require('json-schema');

exports.schemas = {
	collection: {
		description: 'Collection of likes',
		type: 'object',
		properties: {
			'title': {
				required: true,
				type: 'string'
			},
			'public': {
				required: false,
				type: 'boolean'
			},
			'description': {
				required: false,
				type: 'string'
			}
		}
	},

	collectionProperties: {
		description: 'Collection properties',
		type: 'object',
		properties: {
			'color': {
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
