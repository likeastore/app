/* Few common schemas for user login and setup */
var schema = require('json-schema');

exports.schemas = {
	id: {
		type: 'string',
		pattern: /^[a-fA-F0-9]{24}$/
	},

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
			},
			'thumbnail': {
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
			'location': {
				required: false,
				type: 'string'
			},
			'website': {
				required: false,
				type: 'string'
			},
			'twitter': {
				required: false,
				type: 'string'
			},
			'watchedPreview': {
				required: false,
				type: 'boolean'
			},
			'watchedOnlyExtension': {
				required: false,
				type: 'boolean'
			},
			'blockNetworks': {
				required: false,
				type: 'boolean'
			}
		}
	}
};

exports.validate = function (json, model, callback) {
	return schema.validate(json, this.schemas[model]);
};

exports.validateId = function (id) {
	return schema.validate(id, this.schemas.id);
};
