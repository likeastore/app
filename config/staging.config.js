var config = {
	connection: process.env.MONGO_CONNECTION,
	options: { auto_reconnect: true },

	applicationUrl: 'http://app.stage.likeastore.com',
	siteUrl: 'http://stage.likeastore.com',

	// api keys
	services: {
		github: {
			appId: 'dc3c7a7050dccee24ed3',
			appSecret: 'c18dde90f5e928a39b0f0432d5125a3e0a31a23d'
		},

		twitter: {
			consumerKey: 'dgwuxgGb07ymueGJF0ug',
			consumerSecret: 'eusoZYiUldYqtI2SwK9MJNbiygCWOp9lQX7i5gnpWU'
		},

		facebook: {
			appId: '394024317362081',
			appSecret: 'bc86f2ab9afcb1227227146e5ea9ad44'
		},

		stackoverflow: {
			clientId: '1533',
			clientKey: 'J2wyheThU5jYFiOpGG22Eg((',
			clientSecret: 'KOCBFY4OUP6OE7Q1xNw1wA(('
		}
	},

	mandrill: {
		token: '2kXX0stV1Hf56y9DYZts3A'
	},

	collector: {
		// scheduler cycle
		schedulerRestart: 1000,

		// after collector got to normal mode, next scheduled run in 15 mins
		nextNormalRunAfter: 10000,

		// after collector got to rateLimit mode, next scheduled run in hour
		nextRateLimitRunAfter: 1000 * 60 * 60,

		// initial mode quotes
		quotes: {
			github: {
				runAfter: 5000
			},

			twitter: {
				runAfter: 60000
			},

			stackoverflow: {
				runAfter: 5000
			}
		}
	}
};

module.exports = config;