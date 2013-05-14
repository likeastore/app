define(function (require) {

	var GithubController = function  ($scope, api) {
		$scope.title = 'Github';
		$scope.items = api.query({ target: 'github' });
	};

	return GithubController;
});