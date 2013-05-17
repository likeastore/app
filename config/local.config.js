var config = {
	connection: 'mongodb://localhost:27017/likeastoredb',
	options: { auto_reconnect: true },

	// api keys
	services: {
		github: {
			appId: 'dc3c7a7050dccee24ed3',
			appSecret: 'c18dde90f5e928a39b0f0432d5125a3e0a31a23d',
			quotas: {
				requests: { perMinute: 1 },
				repeatAfterMinutes: 15
			}
		},

		twitter: {
			consumerKey: 'dgwuxgGb07ymueGJF0ug',
			consumerSecret: 'eusoZYiUldYqtI2SwK9MJNbiygCWOp9lQX7i5gnpWU',
			quotas: {
				requests: { perMinute: 1 },
				repeatAfterMinutes: 15
			}
		},

		facebook: {
			appId: '394024317362081',
			appSecret: 'bc86f2ab9afcb1227227146e5ea9ad44'
		},

		stackoverflow: {
			clientId: '1533',
			clientKey: 'J2wyheThU5jYFiOpGG22Eg((',
			clientSecret: 'KOCBFY4OUP6OE7Q1xNw1wA((',
			quotas: {
				requests: { perMinute: 1 },
				repeatAfterMinutes: 15
			}
		}
	}
};

module.exports = config;