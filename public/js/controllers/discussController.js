define(function () {
	'use strict';

	function DiscussController ($rootScope, $scope, $routeParams, appLoader, api) {
		$rootScope.title = 'Discuss';

		var id = $routeParams.id;

		loadItem();

		$scope.postComment = function () {
			var comment = {message: this.message, user: $rootScope.user, date: moment().toDate()};
			this.message = '';

			$scope.comments.push(comment);
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
