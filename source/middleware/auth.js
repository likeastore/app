var moment = require('moment');
var crypto = require('crypto');

// TODO: move both to config
var TOKEN_TTL_MINUTES = 1440;
var AUTH_SIGN_KEY = 'c88afe1f6aa4b3c7982695ddd1cdd200bcd96662';

function createToken() {
	return function (req, res, next) {
		var username = req.user.email;
		var timespamp = moment();
		var message = username + ';' + timespamp.valueOf();
		var hmac = crypto.createHmac('sha1', AUTH_SIGN_KEY).update(message).digest('hex');
		var token = username + ';' + timespamp.valueOf() + ';' + hmac;
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
			return next({message: 'User is not authorized', status: 401});
		}

		return next();

		function hmacAuthentication(token) {
			var decoded = new Buffer(token, 'base64').toString();
			var parsed = decoded.split(';');

			if (parsed.length !== 3) {
				return false;
			}

			var username = parsed[0], timespamp = parsed[1], recievedHmac = parsed[2];
			var message = username + ';' + timespamp;
			var computedHmac = crypto.createHmac('sha1', AUTH_SIGN_KEY).update(message).digest('hex');

			if (recievedHmac !== computedHmac) {
				return false;
			}

			var currentTimespamp = moment(), recievedTimespamp = moment(+timespamp);
			if (recievedTimespamp.diff(currentTimespamp, 'minutes') > TOKEN_TTL_MINUTES) {
				return false;
			}

			req.user = username;

			return true;
		}
	};
}

module.exports = {
	createToken: createToken,
	validateToken: validateToken
};