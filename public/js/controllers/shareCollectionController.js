define(function () {
	'use strict';

	function ShareCollectionController ($scope, links, $analytics, analytics, mixpanel) {
		$analytics.eventTrack('collection shared'); // mixpanel
		analytics.track('collection-shared'); // seismo

		mixpanel.people.increment('Collection Shares');

		var data = $scope.$parent.ngDialogData.split(', ');
		$scope.link = links.collection(data[0], data[1]);

		setTimeout(function () {
			document.getElementById('collectionUrl').select();
		}, 100);
	}

	return ShareCollectionController;
});
