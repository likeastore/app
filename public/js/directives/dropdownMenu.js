define(function (require) {
	'use strict';

	var angular = require('angular');

	function DropdownMenu ($document, $rootScope) {
		return {
			restrict: 'A',
			scope: {
				networks: '=dropdownMenu'
			},
			template: '\
				<div class="show-networks header-btn" ng-click="toggleMenu()"><i class="font-icon activity-icon icon"></i> Select</div>\
				<div class="networks-dropdown" ng-class="{active: showDropdown}">\
					<ul ng-if="networks">\
						<li>\
							<a href="/all" class="network-link"\
								ng-class="{active: menuTitle.toLowerCase() === \'all networks\'}">\
								<i class="font-icon activity-icon icon"></i> All networks\
							</a>\
						</li>\
						<li class="network"\
							ng-repeat="network in networks"\
							ng-init="type = network.service === \'gist\' ? \'github\' : network.service"\
							ng-class="{\
								hide: network.service === \'gist\',\
								last: $last\
							}">\
							<a href="/{{network.service}}" class="network-link"\
								ng-class="{active: network.service === menuTitle.toLowerCase()}">\
								<i class="font-icon {{network.service}}-icon icon"></i> {{network.service}}\
							</a>\
						</li>\
					</ul>\
				</div>',
			link: function (scope, elem, attrs) {
				$rootScope.$watch('title', function (value) {
					if (value) {
						scope.menuTitle = (value !== 'All favorites' && value !== 'Inbox') ? value : 'All networks';
					}
				});

				scope.toggleMenu = function () {
					scope.showDropdown = scope.showDropdown ? false : true;
				};

				$document.on('click touchstart', function (e) {
					var target = angular.element(e.target).hasClass('show-networks');

					if (!target) {
						scope.showDropdown = false;
						scope.$apply();
					}
				});
			}
		};
	}

	return DropdownMenu;
});