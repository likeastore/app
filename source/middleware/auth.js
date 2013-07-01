var express = require('express');
var moment = require('moment');
var crypto = require('crypto');

var TOKEN_TTL_MINUTES = 1440;
var AUTH_SIGN_KEY = 'c88afe1f6aa4b3c7982695ddd1cdd200bcd96662';


function createToken() {
	return function (req, res, next) {
		var username = req.user.username;
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
		var basic = express.basicAuth(hmacAuthentication);
		return basic(req, res, next);

		function hmacAuthentication(user, password) {
			var token = new Buffer(password, 'base64').toString();
			var parsed = token.split(';');

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

			return true;
		}
	};
}

module.exports = {
	createToken: createToken,
	validateToken: validateToken
};