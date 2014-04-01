define(function () {
	'use strict';

	function ShareAndUnblockCollection ($scope, $rootScope, api) {
		twttr.widgets.load();
		twttr.events.bind('tweet', function (event) {
			console.dir(event)
		});
	}

	return ShareAndUnblockCollection;
});