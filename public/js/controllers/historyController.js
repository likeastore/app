define(function () {
	'use strict';

	var texts = {
		'like': ['facebook', 'dribbble', 'behance', 'vimeo', 'youtube'],
		'favorite': ['twitter', 'stackoverflow'],
		'star': ['github', 'gist']
	};

	function HistoryController($scope, $rootScope, $analytics, appLoader, api, _) {
		appLoader.loading();

		$analytics.eventTrack('history opened');

		$rootScope.title = 'History';
		$scope.items = [];

		api.get({ resource: 'history' }, function (history) {
			_(history.data).each(function (row) {
				var item = {
					date: row.date,
					services: []
				};

				_(row).chain().omit('date').each(createItem);

				$scope.items.push(item);

				function createItem (val, key, list) {
					if (_(list).max() === val) {
						item.mainService = key;
					}

					item.services.push({
						name: key,
						value: val,
						text: getLikeText(key)
					});
				}

				function getLikeText (service) {
					var text;
					_(texts).each(function (val, key) {
						if (_(val).indexOf(service) !== -1) {
							text = key;
						}
					});
					return text;
				}
			});

			appLoader.ready();
		});
	}

	return HistoryController;
});