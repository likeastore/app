define(function (require) {
	'use strict';

	function Truncate () {
		return function (text, length, end) {
			if (isNaN(length)) {
				length = 100;
			}

			if (!end || typeof end !== 'string') {
				end = "...";
			}

			if (text.length <= length || text.length - end.length <= length) {
				return text;
			} else {
				return text.substring(0, length - end.length) + end;
			}
		};
	}

	return Truncate;
});