$(function () {
	var collection = new ItemsCollection([{description: 'aaaaaaaaaa'}]);
	var view = new ItemsGridView({collection: collection});

	$('.app').html(view.render().el);
});