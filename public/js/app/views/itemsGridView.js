var ItemsGridView = Backbone.View.extend({
	className: 'dashboard',

	render: function () {
		function addItem(model) {
			var view = new ItemView({model: model});
			this.$el.append(view.render().el);
		}

		this.collection.each(addItem, this);
		$('.wrapper').hide();
		this.$el.gridalicious({
			animate: true,
			gutter: 20
		});

		return this;
	}
});