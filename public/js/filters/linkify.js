define(function (require) {
	'use strict';

	function Linkify () {
		return function (text) {
			var urlRegex =/(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
			var result = text.replace(urlRegex, function (url) {
				return '<a href="' + url + '" target="_blank">' + url + '</a>';
			});

			return result;
		};
	}

	return Linkify;
});
