/**
 * Client-side config
 */

define(function () {
	'use strict';

	return {
		dashboard: {
			limit: 30
		},

		extension: {
			chrome: {
				url: 'https://chrome.google.com/webstore/detail/likeastore/einhadilfmpdfmmjnnppomcccmlohjad'
			},

			firefox: {
				url: 'https://addons.mozilla.org/en-US/firefox/addon/likeastore-social-bookmarking-/'
			},

			safari: {
				url: 'http://addons.likeastore.com/files/safari/likeastore.safariextz'
			}
		},

		colors: [
			{ name: 'red', hex: '#e74c3c' },
			{ name: 'orange', hex: '#f39c12' },
			{ name: 'yellow', hex: '#feee43' },
			{ name: 'green', hex: '#56c7aa' },
			{ name: 'blue', hex: '#3498db' },
			{ name: 'violet', hex: '#eab6fd' },
			{ name: 'grey', hex: '#c8c8c8' }
		]
	};
});
