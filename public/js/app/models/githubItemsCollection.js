var GithubItemsCollection = Backbone.Collection.extend({
	model: Item,

	url: '/api/items/github'
});