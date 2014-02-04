var schemas = require('../utils/schemas');

module.exports = function (schema) {
	return function (req, res, next) {
		schemas.validate(req.body, schema, function (err) {
			if (err) {
				return res.send(412, err);
			}
			return next();
		});
	};
};