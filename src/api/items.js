var favorites = require('./../db/favorites.js');
var stars = require('./../db/stars.js');

function items(app) {
	app.get('/api/items', function (req, res) {
		favorites.all(function (err, favs) {
			if (err) {
				return res.send(500);
			}

			stars.all(function (err, strs) {
				if (err) {
					return res.send(500);
				}

				var all = favs.concat(strs);
				return res.json(all);
			});
		});
	});

	app.get('/api/items/github', function (req, res) {
		stars.all(function (err, strs) {
			return res.json(strs);
		});
	});

	app.get('/api/items/twitter', function (req, res) {
		favorites.all(function (err, favs) {
			return res.json(favs);
		});
	});
}

module.exports = items;