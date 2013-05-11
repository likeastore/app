var users = require('./services/usersFactory.js');

function getAll (req, res) {
	users.getAllItems(req.user._id, function (err, items) {
		if (err) {
			return res.json('Error while request');
		}
		res.json(items);
	});
}

function getTwitter (req, res) {
	users.getItemsByType(req.user._id, 'twitter', function (err, items) {
		if (err) {
			return res.json('Error while request');
		}
		res.json(items);
	});
}

function getGithub (req, res) {
	users.getItemsByType(req.user._id, 'github', function (err, items) {
		if (err) {
			return res.json('Error while request');
		}
		res.json(items);
	});
}

module.exports = {
	getAll: getAll,
	getTwitter: getTwitter,
	getGithub: getGithub
};