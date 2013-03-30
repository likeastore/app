function index(everyauth) {

	return {
		index: function (req, res) {
			if (req.loggedIn) {
				res.redirect('/setup');
			}

			res.render('login');
		},
		setup: function(req, res) {
			res.render('setup');
		}
	};
}

module.exports = index;