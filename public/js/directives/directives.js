define(function (require) {
	'use strict';

	var angular = require('angular');
	var ngProgress = require('ngProgress');
	var directives = angular.module('directives', ['ngProgress']);

	directives.directive('menuSlider', require('./menuSlider'));
	directives.directive('toggleSwitcher', require('./toggleSwitcher'));
	directives.directive('textSearch', require('./textSearch'));
	directives.directive('linkify', require('./linkify'));
	directives.directive('stickyAt', require('./stickyAt'));
	directives.directive('dropdownMenu', require('./dropdownMenu'));

	return directives;
});