define(function () {
	'use strict';

	function DiscoverController ($scope, $rootScope, appLoader, api) {
		$rootScope.title = 'Discover';

		$scope.items = [
			{
				user: {
					"avatar": "https://pbs.twimg.com/profile_images/2390350566/a9gljlryvmnbx8y3tq2f.jpeg",
					"displayName": "Alexander Beletsky"
				},
				info: {
					"_id": "52ced41520264f43deed32b8",
					"authorName": "Snask ",
					"authorUrl": "https://www.behance.net/snask",
					"avatarUrl": "https://m1.behance.net/profiles3/93335/50x179386dc62df5fef0829bd8b7d9e47dc.gif",
					"created": "2013-09-24T09:47:51.000Z",
					"date": "2014-01-09T16:53:41.133Z",
					"idInt": 11087397,
					"itemId": "11087397",
					"source": "https://www.behance.net/gallery/Yay-Festival-2012/11087397",
					"thumbnail": "https://m1.behance.net/rendition/projects/11087397/404/2991ce3ca7c19e0e78d35c7b8e9e114d.jpeg",
					"title": "Yay Festival 2012",
					"type": "behance",
					"user": "dmitri.voronianski@gmail.com"
				}
			},
			{
				user: {
					"avatar": "https://1.gravatar.com/avatar/22d82560fdd0169da6004337103e7299?d=https%3A%2F%2Fidenticons.github.com%2F1441da3daa54c7c1e0af988a74fd1c07.png&r=x&s=440",
					"displayName": "Dmitri Voronianski"
				},
				info: {
					"_id": "52cab6bf20264f43deecf1e8",
					"authorName": "Jordi van der Oord",
					"authorUrl": "http://dribbble.com/jordivanderoord",
					"avatarUrl": "http://d13yacurqjgara.cloudfront.net/users/180983/avatars/normal/735861_10151875057689508_1138856551_o.jpg?1380711225",
					"created": "2013-04-26T12:07:46.000Z",
					"date": "2014-01-06T13:59:27.638Z",
					"idInt": 1046154,
					"itemId": "1046154",
					"source": "http://dribbble.com/shots/1046154-Before-Sushi",
					"thumbnail": "http://d13yacurqjgara.cloudfront.net/users/180983/screenshots/1046154/before_sushi.png",
					"title": "Before Sushi",
					"type": "dribbble",
					"user": "dmitri.voronianski@gmail.com"
				}
			},
			{
				user: {
					"avatar": "https://1.gravatar.com/avatar/22d82560fdd0169da6004337103e7299?d=https%3A%2F%2Fidenticons.github.com%2F1441da3daa54c7c1e0af988a74fd1c07.png&r=x&s=440",
					"displayName": "Dmitri Voronianski"
				},
				info: {
					"_id": "52cee48320264f43deed337a",
					"authorName": "dmitri.voronianski",
					"avatarUrl": "https://scontent-b.xx.fbcdn.net/hphotos-prn1/s720x720/1528713_419537194844835_1486416725_n.png",
					"created": "2014-01-09T17:34:59.000Z",
					"date": "2014-01-09T18:03:47.161Z",
					"description": "We anticipate designers' happiness! Behance is in! - Timeline Photos",
					"idInt": "10201904406866247",
					"itemId": "10201904406866247",
					"kind": "link",
					"name": "Dmitri Voronianski",
					"source": "https://www.facebook.com/photo.php?fbid=419537194844835&set=a.357577534374135.1073741827.354196724712216&type=1",
					"type": "facebook",
					"user": "dmitri.voronianski@gmail.com"
				}
			},
			{
				user: {
					"avatar": "https://1.gravatar.com/avatar/22d82560fdd0169da6004337103e7299?d=https%3A%2F%2Fidenticons.github.com%2F1441da3daa54c7c1e0af988a74fd1c07.png&r=x&s=440",
					"displayName": "Dmitri Voronianski"
				},
				info: {
					"_id": "52bc33fe20264f43deec72d1",
					"authorName": "Ambar Navarro",
					"authorUrl": "http://vimeo.com/ambarnavarro",
					"avatarUrl": "http://b.vimeocdn.com/ps/676/904/6769040_100.jpg",
					"created": "2013-12-16T00:10:46.000Z",
					"date": "2013-12-26T13:49:50.716Z",
					"description": "Animated/Directed by Ambar Navarro\nMusic by Hyperbubble, www.hyperbubble.net\n\nAdditional Animation by\nJulian Petschek\nTempe Hale\nQuique Rivera Rivera\nIsabela Dos Santos\nTomas Christian\n\nPost-Prod done by Julian Petschek\n\nShot at BE∆RD H∆US\n\nCALARTS 2013",
					"itemId": "81973720",
					"source": "http://vimeo.com/81973720",
					"thumbnail": "http://b.vimeocdn.com/ts/458/206/458206358_640.jpg",
					"title": "Hyperbubble - A Synthesizer for Christmas",
					"type": "vimeo",
					"user": "dmitri.voronianski@gmail.com"
				}
			}
		];

		appLoader.ready();
	}

	return DiscoverController;
});