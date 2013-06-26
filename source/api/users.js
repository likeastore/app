var users = require('../db/users.js');
var items = require('../db/items.js');
var nets = require('../db/networks.js');
var logger = require('../utils/logger');

function usersService (app) {
	app.get('/api/users', getUser);

	function getUser(req, res) {
		users.findByEmail(req.user, function (err, user) {
			if (err) {
				return res.send(500, err);
			}

			res.json(user);
		});
	}
}

module.exports = usersService;