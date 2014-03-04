/* Few common schemas for user login and setup */
var schema = require('json-schema');

exports.schemas = {
	collection: {
		description: 'Collection of likes',
		type: 'object',
		additionalProperties: false,
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
			},
			'color': {
				required: false,
				type: 'string'
			}
		}
	},

	collectionPatch: {
		description: 'Collection properties allowed to change',
		type: 'object',
		additionalProperties: false,
		properties: {
			'title': {
				required: false,
				type: 'string'
			},
			'public': {
				required: false,
				type: 'boolean'
			},
			'description': {
				required: false,
				type: 'string'
			},
			'color': {
				required: false,
				type: 'string'
			}
		}
	},

	userPatch: {
		description: 'User properties allowed to change',
		type: 'object',
		additionalProperties: false,
		properties: {
			'displayName': {
				required: false,
				type: 'string'
			},
			'bio': {
				required: false,
				type: 'string'
			},
			'watchedPreview': {
				required: false,
				type: 'boolean'
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
