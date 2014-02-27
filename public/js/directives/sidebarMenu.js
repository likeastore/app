define(function (require) {
	'use strict';

	var angular = require('angular');

	function SidebarMenu ($document) {
		return {
			restrict: 'A',
			templateUrl: '/partials/navigation.ejs',
			link: function (scope, elem, attrs) {
				var $body = $document.find('body');

				scope.showSidebar = function () {
					$body.addClass('sidebar-active');
				};

				$document.on('click touchstart', function (e) {
					var $target = angular.element(e.target);
					var close = $target.hasClass('sidebar-overlay') || $target.hasClass('close-sidebar');

					if (close) {
						$body.removeClass('sidebar-active');
					}
				});
			}
		};
	}

	return SidebarMenu;
});