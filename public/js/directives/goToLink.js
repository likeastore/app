define(function (require) {
	'use strict';

	var $el = require('angular').element;

	var clickableElementClasses = [
		'dash-item',
		'title',
		'description',
		'cover',
		'info',
		'author-name',
		'author-image'
	];

	function GoToLink ($window) {
		return {
			restrict: 'A',
			link: function (scope, elem, attrs) {
				var url = attrs.goToLink;

				elem.on('click', function (e) {
					var $target = $el(e.target);
					var clickable = _(clickableElementClasses).find(function (cls) {
						return $target.hasClass(cls);
					});

					if (clickable) {
						$window.open(url, '_tab');
					}
				});
			}
		};
	}

	return GoToLink;
});
