var config = {
	connection: 'mongodb://localhost:27017/likeastoredb',
	options: {auto_reconnect: true},

	// api keys
	github: {
		appId: '3a3bd66d4ddb7b38588c',
		appSecret: '07c869fe1c19c0278b7481acf4d8e988421fed06'
	},
	twitter: {
		consumerKey: 'dgwuxgGb07ymueGJF0ug',
		consumerSecret: 'eusoZYiUldYqtI2SwK9MJNbiygCWOp9lQX7i5gnpWU'
	},
	facebook: {
		appId: '394024317362081',
		appSecret: 'bc86f2ab9afcb1227227146e5ea9ad44'
	}
};

module.exports = config;