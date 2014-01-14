var config = {
	connection: process.env.MONGO_CONNECTION,
	options: { auto_reconnect: true },

	applicationUrl: 'https://app-stage.likeastore.com',
	siteUrl: 'https://stage.likeastore.com',
	domain: '.likeastore.com',
	authCookie: 'token',

	hashids: {
		salt: '0b208b34946d64c41a11bab4eb34a7c6515ac2e9'
	},

	// api keys
	services: {
		github: {
			appId: '47974c5d6fefbe07881e',
			appSecret: 'f1008ace415b3892bd36ef97443452a39dd7c29f'
		},

		twitter: {
			consumerKey: 'XDCQAahVo1EjhFqGoh5c2Q',
			consumerSecret: 'LppQuUU5FDTRwFJRwnlhfGj3IMDDTKmVCUm1JTHkA'
		},

		facebook: {
			appId: '554634024574376',
			appSecret: 'a8d2c5e643b67cdf80ed8b8832634b2c'
		},

		stackoverflow: {
			clientId: '1801',
			clientKey: 'L)KUpw85QEW105j43oik8g((',
			clientSecret: 'DadJ5kAh3YWlj0wv7EHqDg(('
		},

		vimeo: {
			clientId: 'c83157e81d0bd1f4a20ffed96c1b9f8d4d97a9dd',
			clientSecret: '34a99e44d55d78cad9e842caf376501a9547028d'
		},

		youtube: {
			clientId: '448353031199-vm7a5vrs3m0frtm7rrpnnsson3cha3a2.apps.googleusercontent.com',
			clientSecret: 'nag018PB5ijVec9ZWcpsnyRd'
		},

		behance: {
			clientId: 'uzBD0GX9Q0CwE3tE9hw69wTpI6P1VBu1',
			clientSecret: 'baScisHRs3Af11.E7OlC4q2jyrD7fj._'
		}
	},

	mandrill: {
		token: process.env.MANDRILL_TOKEN
	},

	logentries: {
		token: process.env.LOGENTRIES_TOKEN
	},

	analytics: {
		url: 'http://analytics.stage.likeastore.com',
		application: 'likeastore-staging',
		username: 'likeastore',
		password: 'likeadmin7analitics'
	},

	newrelic: {
		application: 'likeastore-app-staging',
		licenseKey: 'e5862474ee62b99898c861dddfbfa8a89ac54f49'
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