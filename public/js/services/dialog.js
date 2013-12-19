define(function (require) {
	'use strict';

	var angular = require('angular');
	var $el = angular.element;

	function Dialog ($document, $templateCache, $compile, $q, $rootScope) {
		var animationEndEvent = 'animationend webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend';
		var $body = $document.find('body');
		var $template;

		var privateMethods = {
			onDocumentClick: function (event) {
				var isOverlay = $el(event.target).hasClass('lsd-overlay');
				var isCloseBtn = $el(event.target).hasClass('lsd-close');

				if (isOverlay || isCloseBtn) {
					publicMethods.close();
				}
			},
			onDocumentKeyUp: function (event) {
				if (event.keyCode === 27) {
					publicMethods.close();
				}
			}
		};

		var publicMethods = {
			open: function (options) {
				options = options || {};

				// init scope
				options.scope = options.scope || $rootScope.$new();

				// setup custom template
				options.template = $templateCache.get(options.template) || 'Empty template';
				options.template += '<div class="lsd-close"></div>';

				// use template
				$template = $el('<div class="lsd"></div>');
				$template.html('<div class="lsd-overlay"></div><div class="lsd-content">' + options.template + '</div>');

				if (options.className) {
					$template.addClass(options.className);
				}

				$compile($template)(options.scope);

				$body.addClass('lsd-open').append($template);
				$body.bind('keyup', privateMethods.onDocumentKeyUp);
				$body.bind('click', privateMethods.onDocumentClick);
			},

			close: function () {
				$body.unbind('keyup').unbind('close').removeClass('lsd-open');
				$template.unbind(animationEndEvent).bind(animationEndEvent, function () {
					$template.remove();
				}).addClass('lsd-closing');
			}
		};

		return publicMethods;
	}

	return Dialog;
});
