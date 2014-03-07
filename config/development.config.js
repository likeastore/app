var config = {
	connection: 'mongodb://localhost:27017/likeastoredb',
	options: { auto_reconnect: true },

	applicationUrl: 'http://localhost:3001',
	siteUrl: 'http://localhost:3000',
	domain: '',
	authCookie: 'token',

	hashids: {
		salt: '0b208b34946d64c41a11bab4eb34a7c6515ac2e9'
	},

	tracking: {
		enabled: false
	},

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
		},

		vimeo: {
			clientId: 'd445a0de20a3b178b0422ad0c6d5891bdfd00b97',
			clientSecret: 'e8e0008413ae1d1ed3e45d8c89d7943ad3937167'
		},

		youtube: {
			clientId: '955769903356-5f1407fo9efvljm3hhl5b8mbhos61blq.apps.googleusercontent.com',
			clientSecret: 'QtlyTnCusfX7G7fbjaEkdmHK'
		},

		behance: {
			clientId: 'JyyJsEZRbcqTXcukjnq8ivQMb7BfAIUd',
			clientSecret: 'L2s8uQl3s7G5uy2ECeRp9dHeWuyA6mrj'
		},

		vk: {
			clientId: '4195920',
			clientSecret: '1IATKWbudSUmp49uVfsn'
		},

		pocket: {
			consumerKey: '24341-1a1bc9c0ad0f3ffa9eb3194b'
		},

		tumblr: {
			consumerKey: '6vUnFztIzNd6ISG8kBn7UyhGkHA8a49UjXUx9rCYbrWBnbFZBr',
			consumerSecret: 'pnUrbwgmLHubWqaBxRIzD216FxAq8wZCzf2hXysL9huV1Sfq9R'
		}
	},

	mandrill: {
		token: '2kXX0stV1Hf56y9DYZts3A'
	},

	logentries: {
		token: null
	},

	analytics: {
		url: 'http://localhost:3005',
		application: 'likeastore-development',
		username: 'likeastore',
		password: 'mypass'
	},

	ga: {
		id: 'UA-41034999-1',
		domain: 'localhost'
	},

	newrelic: {
		application: 'likeastore-app-development',
		licenseKey: null
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