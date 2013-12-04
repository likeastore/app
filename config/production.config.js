var config = {
	connection: process.env.MONGO_CONNECTION,
	options: { auto_reconnect: true },

	applicationUrl: 'https://app.likeastore.com',
	siteUrl: 'https://likeastore.com',

	// api keys
	services: {
		github: {
			appId: process.env.GITHUB_APP_ID,
			appSecret: process.env.GITHUB_APP_SECRET
		},

		twitter: {
			consumerKey: process.env.TWITTER_CONSUMER_KEY,
			consumerSecret: process.env.TWITTER_CONSUMER_SECRET
		},

		facebook: {
			appId: process.env.FACEBOOK_APP_ID,
			appSecret: process.env.FACEBOOK_APP_SECRET
		},

		stackoverflow: {
			clientId: process.env.STACKOVERFLOW_CLIENT_ID,
			clientKey: process.env.STACKOVERFLOW_CLIENT_KEY,
			clientSecret: process.env.STACKOVERFLOW_CLIENT_SECRET
		}
	},

	mandrill: {
		token: process.env.MANDRILL_TOKEN
	},

	logentries: {
		token: process.env.LOGENTRIES_TOKEN
	},

	analytics: {
		url: 'https://analytics.likeastore.com',
		username: 'likeastore',
		password: 'likeadmin7analitics'
	},

	collector: {
		// scheduler cycle
		schedulerRestart: 1000,

		// after collector got to normal mode, next scheduled run in 15 mins
		nextNormalRunAfter: 1000 * 60 * 15,

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