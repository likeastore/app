$(function () {
	var collection = new ItemsCollection();
	var options = {
		success: function (fetched) {
			var view = new ItemsGridView({collection: fetched}).render();
			$('.app').html(view.el);
		}
	};

	collection.fetch(options);
});