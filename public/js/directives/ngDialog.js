define(function (require) {
	'use strict';

	function NgDialog (api, dialog) {
		return {
			restrict: 'A',
			link: function (scope, elem, attr) {
				elem.on('click', function (e) {
					e.preventDefault();
					dialog.open({ className: attr.ngDialogClass, template: attr.ngDialog });
				});
			}
		};
	}

	return NgDialog;
});