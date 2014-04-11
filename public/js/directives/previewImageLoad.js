define(function (require) {
	'use strict';

	function PreviewImageLoad () {
		return {
			restrict: 'A',
			scope: {
				lowLevel: '=previewImageLoad'
			},
			link: function (scope, elem, attrs) {
				var image = new Image();
				image.src = attrs.ngSrc || attrs.src;

				var actualImgWidth = image.naturalWidth || image.width;
				if (actualImgWidth < scope.lowLevel) {
					elem.addClass('low-image-res');
				}

				elem.on('error', function (event) {
					elem.attr('src', '/img/default-preview.png');
				});
			}
		};
	}

	return PreviewImageLoad;
});
