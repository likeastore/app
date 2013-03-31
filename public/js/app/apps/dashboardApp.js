$(function () {
	var collection = new ItemsCollection();
	var options = {
		success: function (fetched) {
			var view = new ItemsGridView({collection: fetched});
			$('.app').html(view.render().el);
		}
	};

	collection.fetch(options);
});