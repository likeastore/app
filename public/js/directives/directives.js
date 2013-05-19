define(function (require) {
	'use strict';

	var angular = require('angular');
	var directives = angular.module('directives', []);

	directives.directive('menuSlider', require('./menuSlider'));
	directives.directive('toggleSwitcher', require('./toggleSwitcher'));

	return directives;
});