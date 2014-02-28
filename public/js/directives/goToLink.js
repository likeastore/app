define(function (require) {
	'use strict';

	var $el = require('angular').element;

	function GoToLink ($window) {
		return {
			restrict: 'A',
			link: function (scope, elem, attrs) {
				var url = attrs.goToLink;
				elem.on('click', function (e) {
					var $target = $el(e.target);
					var actions = $target.parent().parent().hasClass('action-buttons') ||
								$target.parent().parent().parent().parent().hasClass('action-buttons');

					if (!actions) {
						$window.open(url, '_tab');
					}
				});
			}
		};
	}

	return GoToLink;
});