define(function (require) {
	'use strict';

	function Linkify ($sce) {
		return function (text) {
			var urlRegex =/(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;

			var result = text.replace(urlRegex, function (url) {
				return '<a href="' + url + '" target="_blank">' + url + '</a>';
			});

			return $sce.trustAsHtml(result);
		};
	}

	return Linkify;
});