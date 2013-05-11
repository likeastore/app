var config = {
	connection: 'mongodb://localhost:27017/likeastoredb',
	options: { auto_reconnect: true },

	// api keys
	services: {
		github: {
			appId: '3a3bd66d4ddb7b38588c',
			appSecret: '07c869fe1c19c0278b7481acf4d8e988421fed06',
			quotas: {
				requests: { perMinute: 30 }
			}
		},

		twitter: {
			consumerKey: 'dgwuxgGb07ymueGJF0ug',
			consumerSecret: 'eusoZYiUldYqtI2SwK9MJNbiygCWOp9lQX7i5gnpWU',
			quotas: {
				requests: { perMinute: 1 }
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
				requests: { perMinute: 1 }
			}
		}
	}
};

module.exports = config;