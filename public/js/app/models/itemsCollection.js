var ItemsCollection = Backbone.Collection.extend({
	model: Item,

	url: '/api/items'
});