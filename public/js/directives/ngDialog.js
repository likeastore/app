define(function (require) {
	'use strict';

	function NgDialog (api, dialog) {
		return {
			restrict: 'A',
			scope: {},
			link: function (scope, elem, attr) {
				elem.on('click', function () {
					dialog.open({
						className: attr.ngDialogClass,
						template: attr.ngDialog
					});
				});
			}
		};
	}

	return NgDialog;
});