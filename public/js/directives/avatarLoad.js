define(function (require) {
	'use strict';

	function AvatarLoad () {
		return {
			restrict: 'A',
			link: function (scope, elem, attr) {
				elem.bind('error', function (event) {
					elem.attr('src', '/img/gravatar.png');
				});
			}
		};
	}

	return AvatarLoad;
});