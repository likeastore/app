var favorites = require('./../db/favorites.js');
var stars = require('./../db/stars.js');

function items(app) {
	app.get('/api/items', function (req, res) {
		favorites.all(function (err, favs) {
			if (err) {
				console.log(err);
				return res.send(500);
			}

			stars.all(function (err, strs) {
				if (err) {
					return res.send(500);
				}

				var all = favs.concat(strs);
				var response = [];
				all.forEach(function (item) {
					response.push(item.value);
				});

				return res.json(response);
			});
		});
	});

	app.get('/api/items/github', function (req, res) {
		stars.all(function (err, strs) {
			var response = [];
			strs.forEach(function (item) {
				response.push(item.value);
			});

			return res.json(response);
		});
	});

	app.get('/api/items/twitter', function (req, res) {
		favorites.all(function (err, favs) {
			var response = [];
			favs.forEach(function (item) {
				response.push(item.value);
			});

			return res.json(response);
		});
	});
}

module.exports = items;