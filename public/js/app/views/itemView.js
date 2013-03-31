var ItemView = Backbone.View.extend({
	template: '<%= description %> <div class="res-ico git-wm"></div>',

	className: 'item',

	initialize: function () {

	},

	render: function () {
		var content = _.template(this.template, this.model.toJSON());
		this.$el.html(content);

		return this;
	}
});