var config = {
	connection: 'mongodb://localhost:27017/likeastoredb',
	options: { auto_reconnect: true },

	applicationUrl: 'http://localhost:3001',
	siteUrl: 'http://localhost:3000',
	domain: '',

	app: {
		pageSize: 32
	},

	elastic: {
		connection: 'http://localhost:9200'
	},

	auth: {
		cookieName: 'auth_token',
		signKey: 'c88afe1f6aa4b3c7982695ddd1cdd200bcd96662',
		tokenTtl: 525600, // minutes, 365 days
		secure: false
	},

	hashids: {
		salt: '0b208b34946d64c41a11bab4eb34a7c6515ac2e9'
	},

	tracker: {
		url: 'http://localhost:3006'
	},

	tracking: {
		enabled: false
	},

	nodalytics: {
		ua: null
	},

	notifier: {
		url: 'http://localhost:3031',
		accessToken: '1234'
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
		},

		instagram: {
			clientId: '892d480a24be4f6ebea65b1799acd643',
			clientSecret: 'dd70232e5b4f40208f60b1f2430b5bf7'
		},

		flickr: {
			consumerKey: 'de1be7a4d307073deca73ad46d9faf40',
			consumerSecret: '6103498d0db1c48a'
		}
	},

	mandrill: {
		token: null
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
	}
};

module.exports = config;
