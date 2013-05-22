define(function (require) {
	'use strict';

	var angular = require('angular');
	var directives = angular.module('directives', []);

	directives.directive('menuSlider', require('./menuSlider'));
	directives.directive('toggleSwitcher', require('./toggleSwitcher'));
	directives.directive('linkify', require('./linkify'));
	directives.directive('stickyAt', require('./stickyAt'));
	directives.directive('dropdownMenu', require('./dropdownMenu'));

	return directives;
});