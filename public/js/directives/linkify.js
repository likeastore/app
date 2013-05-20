define(function (require) {
	'use strict';

	function Linkify () {
		return {
			restrict: 'A',
			link: function (scope, elem, attr) {
				var urlRegex =/(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
				var text = scope.$eval(attr.linkify);

				var result = text.replace(urlRegex, function (url) {
					return '<a href="' + url + '" target="_blank">' + url + '</a>';
				});

				elem.html(result);
			}
		};
	}

	return Linkify;
});