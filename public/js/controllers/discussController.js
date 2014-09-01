define(function () {
	'use strict';

	function DiscussController ($rootScope, $scope) {
		var comments = $scope.comments = [];

		$scope.postComment = function () {
			var comment = {message: this.message, user: $rootScope.user, date: moment().toDate()};
			this.message = '';

			comments.push(comment);
		};

		$scope.ago = function (date) {
			return moment.duration(new Date() - date).humanize(true);
		};
	}

	return DiscussController;
});
