define(function (require) {
	'use strict';

	function ToggleClassFollowCollection ($rootScope, api, $analytics) {
		return {
			restrict: 'A',
			scope: {
				collectionId: "=ecFollow"
			},
			link: function (scope, elem, attrs) {
				elem.on('click', function (e) {
					e.preventDefault();

					if (elem.hasClass('on')) {
						elem.removeClass('on');
						$rootScope.$broadcast('unfollow.collection', scope.collectionId);
						$analytics.eventTrack('collection unfollowed');
						api.delete({ resource: 'collections', target: scope.collectionId, verb: 'follow' }, {});
					} else {
						elem.addClass('on');
						$rootScope.$broadcast('follow.collection', scope.collectionId);
						$analytics.eventTrack('collection followed');
						api.update({ resource: 'collections', target: scope.collectionId, verb: 'follow' }, {});
					}
				});
			}
		};
	}

	return ToggleClassFollowCollection;
});
