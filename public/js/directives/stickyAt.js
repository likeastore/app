define(function (require) {
	'use strict';

	function StickyAt ($window) {
		return {
			restrict: 'A',
			link: function (scope, elem, attrs) {
				console.dir(elem);
				function scrollTop () {
					return ($window.pageYOffset !== undefined) ? $window.pageYOffset : (document.documentElement || document.body).scrollTop;
				}

				$window.onscroll = function () {
					elem.toggleClass('sticky', scrollTop() > +attrs.stickyAt);
				};
			}
		};
	}

	return StickyAt;
});