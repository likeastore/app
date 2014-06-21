define(function (require) {
	'use strict';

	var parentAnimateClasses = 'animated flip';
	var childAnimateClasses = 'animated delay-1s fadeIn';

	function ToggleClassFollowCollection ($rootScope, api, $analytics) {
		return {
			restrict: 'A',
			scope: {
				collectionId: "=ecFollow"
			},
			link: function (scope, elem, attrs) {
				var $parent = elem.parent();
				var $child = elem.children();

				elem.on('click', function (e) {
					e.preventDefault();

					if (elem.hasClass('on')) {
						elem.removeClass('on');

						$parent.removeClass(parentAnimateClasses);
						$child.removeClass(childAnimateClasses);

						$rootScope.$broadcast('unfollow.collection', scope.collectionId);
						$analytics.eventTrack('collection unfollowed');

						api.delete({ resource: 'collections', target: scope.collectionId, verb: 'follow' }, {});
					} else {
						elem.addClass('on');

						$parent.addClass(parentAnimateClasses);
						$child.addClass(childAnimateClasses);
						setTimeout(function () {
							$parent.removeClass(parentAnimateClasses);
							$child.removeClass(childAnimateClasses);
						}, 2000);

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
