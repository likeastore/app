define(function (require) {
	'use strict';

	function StickyAt ($window, $rootScope) {
		return {
			restrict: 'A',
			link: function (scope, elem, attrs) {
				var offset = scope.$eval(attrs.stickyAt);

				$rootScope.$watch('user.warningHidden', function (value) {
					if (value) {
						offset = 50;
					}
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