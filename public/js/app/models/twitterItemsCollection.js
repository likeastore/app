var TwitterItemsCollection = Backbone.Collection.extend({
	model: Item,

	url: '/api/items/twitter'
});