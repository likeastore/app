define(function (require) {
	'use strict';

	require('ngProgressLite');

	var angular = require('angular');
	var directives = angular.module('directives', ['ngProgressLite']);

	directives.directive('toggleSwitcher', require('./toggleSwitcher'));
	directives.directive('textSearch', require('./textSearch'));
	directives.directive('stickyAt', require('./stickyAt'));
	directives.directive('dropdownMenu', require('./dropdownMenu'));
	directives.directive('sidebarMenu', require('./sidebarMenu'));
	directives.directive('shareOn', require('./shareOn'));
	directives.directive('autoFocus', require('./autoFocus'));
	directives.directive('avatarLoad', require('./avatarLoad'));
	directives.directive('previewImageLoad', require('./previewImageLoad'));
	directives.directive('tooltip', require('./tooltip'));
	directives.directive('lazyAutocomplete', require('./lazyAutocomplete'));
	directives.directive('scrolly', require('./scrolly'));
	directives.directive('goToLink', require('./goToLink'));

	// collections
	directives.directive('storeIt', require('./storeToCollectionPopup'));
	directives.directive('addCollection', require('./addCollection'));
	directives.directive('addCollectionPopup', require('./addCollectionPopup'));
	directives.directive('editCollection', require('./editCollection'));
	directives.directive('toggleFollowCollection', require('./toggleFollowCollection'));
	directives.directive('ecFollow', require('./toggleClassFollowCollection'));

	return directives;
});
