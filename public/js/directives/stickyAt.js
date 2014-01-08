define(function (require) {
	'use strict';

	var offset;

	function StickyAt ($window, $rootScope) {
		return {
			restrict: 'A',
			link: function (scope, elem, attrs) {
				offset = scope.$eval(attrs.stickyAt);

				$rootScope.$watch('user.warning', function (value) {
					offset = value ? 90 : 50;
				});

				$window.onscroll = function () {
					elem.toggleClass('sticky', scrollTop() > +offset);
				};

				function scrollTop () {
					return ($window.pageYOffset !== undefined) ? $window.pageYOffset : (document.documentElement || document.body).scrollTop;
				}
			}
		};
	}

	return StickyAt;
});