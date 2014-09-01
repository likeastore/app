function commentsService(app) {
	app.get('/api/comments',
		getComments);

	app.post('/api/comments/item/:id',
		postItemComment);

	app.post('/api/comments/collection/:id',
		postCollectionComment);

	app.get('/api/comments/item/:id',
		getItemComments);

	app.get('/api/comments/collection/:id',
		getCollectionComments);

	function getComments(req, res, next) {
		req.send(200);
	}

	function postItemComment(req, res, next) {
		req.send(201);
	}

	function postCollectionComment(req, res, next) {
		req.send(201);
	}

	function getItemComments(req, res, next) {
		req.send(200);
	}

	function getCollectionComments(req, res, next) {
		req.send(200);
	}
}

module.exports = commentsService;
