define(function () {
	'use strict';

	function DiscussController ($rootScope, $scope, $routeParams, appLoader, api) {
		$rootScope.title = 'Discuss';

		var id = $routeParams.id;

		loadItem();

		$scope.postComment = function () {
			var me = this;

			var comment = {message: me.message};
			api.post({resource: 'items', target: id, verb: 'comment'}, comment, function (comment) {
				$scope.comments.push(comment);
				me.message = '';
			});
		};

		$scope.ago = function (date) {
			return moment.duration(new Date() - date).humanize(true);
		};

		function loadItem() {
			appLoader.loading();
			api.get({resource: 'items', target: 'id', verb: id}, function (item) {
				$scope.item = item;
				$scope.comments = item.comments || [];

				appLoader.ready();
			});
		}
	}

	return DiscussController;
});
