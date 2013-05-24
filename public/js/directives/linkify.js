define(function (require) {
	'use strict';

	function Linkify () {
		return {
			restrict: 'A',
			scope: {
				text: '=linkify'
			},
			link: function (scope, elem, attr) {
				var urlRegex =/(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;

				var result = scope.text.replace(urlRegex, function (url) {
					return '<a href="' + url + '" target="_blank">' + url + '</a>';
				});

				elem.html(result);
			}
		};
	}

	return Linkify;
});