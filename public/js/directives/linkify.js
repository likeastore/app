define(function (require) {
	'use strict';

	var angular = require('angular');

	function Linkify () {
		return {
			restrict: 'A',
			link: function (scope, elem, attr) {
				var urlRegex =/(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
				var desc = scope.$eval(attr.linkify);

				var result = desc.replace(urlRegex, function (url) {
					return '<a href="' + url + '" target="_blank">' + url + '</a>';
				});

				angular.element(elem).html(result);
			}
		};
	}

	return Linkify;
});