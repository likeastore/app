var config = require('../config');

function getRootUrl () {
	return config.applicationUrl;
}

module.exports = {
	getRootUrl: getRootUrl
};