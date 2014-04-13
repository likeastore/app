define(function (require) {
	'use strict';

	function AutoFocus ($timeout) {
		return {
			restrict: 'A',
			scope: {
				trigger: '=autoFocus'
			},
			link: function (scope, elem, attrs) {
				var isTrigger = attrs.autoFocus;

				if (isTrigger) {
					scope.$watch('trigger', function (value) {
						if (!value) {
							return;
						}

						callFocus();
					});
				} else {
					callFocus();
				}

				function callFocus() {
					$timeout(function () {
						elem[0].focus();
					}, 0);
				}
			}
		};
	}

	return AutoFocus;
});
