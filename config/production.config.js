var config = {
	connection: process.env.MONGO_CONNECTION,
	options: {auto_reconnect: true}
};

module.exports = config;