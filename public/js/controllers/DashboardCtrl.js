/* App dashboard controller */

'use strict'

function DashboardCtrl ($scope, api) {
	$scope.title = 'Inbox';
	$scope.items = api.query({ target: 'all' });
}

function TwitterCtrl ($scope, api) {
	$scope.title = 'Twitter';
	$scope.items = api.query({ target: 'twitter' });
}

function GithubCtrl ($scope, api) {
	$scope.title = 'Github';
	$scope.items = api.query({ target: 'github' });
}