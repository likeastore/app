var moment = require('moment');
var crypto = require('crypto');
var config = require('../../config');
var logger = require('../utils/logger');

function createToken() {
	return function (req, res, next) {
		var email = req.user.email;
		var timespamp = moment();
		var message = email + ';' + timespamp.valueOf();
		var hmac = crypto.createHmac('sha1', config.auth.signKey).update(message).digest('hex');
		var token = email + ';' + timespamp.valueOf() + ';' + hmac;
		var tokenBase64 = new Buffer(token).toString('base64');

		req.token = tokenBase64;

		next();
	};
}

function validateToken () {
	return function (req, res, next) {
		var token = req.headers['x-access-token'] || req.query.accessToken || req.cookies.token;

		if (!token) {
			return next({message: 'Access token is missing', status: 401});
		}

		if (!hmacAuthentication(token)) {
			return next({message: 'User is not authorized (hmac auth failed)', status: 401});
		}

		return next();

		function hmacAuthentication(token) {
			var decoded = new Buffer(token, 'base64').toString();
			var parsed = decoded.split(';');

			if (parsed.length !== 3) {
				return false;
			}

			var email = parsed[0], timespamp = parsed[1], recievedHmac = parsed[2];
			var message = email + ';' + timespamp;
			var computedHmac = crypto.createHmac('sha1', config.auth.signKey).update(message).digest('hex');

			if (recievedHmac !== computedHmac) {
				logger.warning({message: 'recieved hmac and computed mac are different', recieved: recievedHmac, computed: computedHmac});
				return false;
			}

			var currentTimespamp = moment(), recievedTimespamp = moment(+timespamp);
			var tokenLife = currentTimespamp.diff(recievedTimespamp, 'minutes');

			logger.info({message: 'current token', token: token, user: email, life: tokenLife});

			if (tokenLife >= config.auth.tokenTtl) {
				logger.warning({message: 'timespamp check failed', current: currentTimespamp.toDate(), recieved: recievedTimespamp.toDate(), diff: tokenLife});
				return false;
			}

			req.user = email;

			return true;
		}
	};
}

module.exports = {
	createToken: createToken,
	validateToken: validateToken
};
