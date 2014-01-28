define(function () {
	'use strict';

	function SuggestPeopleController ($scope, $rootScope, $analytics, appLoader, api) {
		appLoader.loading();

		$analytics.eventTrack('suggest opened');

		$rootScope.title = 'Find people';

		api.query({ resource: 'users', target: 'me', verb: 'suggest' }, function (people) {
			$scope.people = people;
			appLoader.ready();
		});

		$scope.followPerson = function (id, $event) {
			if ($event.target.className.indexOf('disabled') !== -1) {
				return;
			}

			$scope.followDisabled = true;
			api.save({ resource: 'users', target: 'me', verb: 'follow', suffix: id }, {});
		};
	}

	return SuggestPeopleController;
});