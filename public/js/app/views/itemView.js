var ItemView = Backbone.View.extend({
	template: '<img src="<%= model.avatarUrl %>" /> <%= model.description %> <div class="res-ico <%= type %>"></div>',

	className: 'item',

	initialize: function () {

	},

	render: function () {
		var type = this.model.get('type') === 'twitter' ? 'twitter-wm' : 'git-wm';
		var content = _.template(this.template, { model: this.model.toJSON(), type: type});
		this.$el.html(content);

		return this;
	}
});