define(function () {
	'use strict';

	function ShareLikeController ($scope, links, $analytics, analytics, mixpanel) {
		$analytics.eventTrack('like shared'); // mixpanel
		analytics.track('like-shared'); // seismo

		mixpanel.people.increment('Likes Shares');

		var like = $scope.$parent.ngDialogData.split(', ');

		$scope.link = links.share(like[0]);
		$scope.service = like[1];
		$scope.title = like[2] || 'Like';

		setTimeout(function () {
			document.getElementById('likeUrl').select();
		}, 100);
	}

	return ShareLikeController;
});
