process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var util = require('util');
var async = require('async');
var config = require('../config');
var db = require('../source/db')(config);

var Intercom = require('intercom.io');
var opts = {
	appId: '8aa471d88de92f2f1f1a2fc08438fc69f4d9146e',
	apiKey: '143213bd65bb237a83968bca8e14e2d0f838d692'
};

var results = {
	users: [],
	services: {}
};

var queue = async.queue(function (data, callback) {
	db.networks.find({ user: data.email }, function (err, networks) {
		handleError(err);

		var userData = {
			user: data.email,
			count: networks.length,
			networks: networks
		};

		results.users.push(userData);
		networks.forEach(addNetworkResults);

		callback();

		function addNetworkResults (network) {
			checkNetworksResult(network.service);
		}

		function checkNetworksResult (service) {
			if (service) {
				if (!results.services[service]) {
					results.services[service] = {
						users: []
					};
				}
				results.services[service].users.push(data.email);
			}
		}
	});
});

queue.drain = function () {
	if (process.argv[2] === '--print') {
		util.print(util.inspect(results, { depth: 20 }));
		console.log('\n');
	}

	console.info('ALL STATS:\n');

	for (var service in results.services) {
		if (process.argv[2] === '--print') {
			util.print(util.inspect(results.services[service], { depth: 20 }));
			console.log('\n');
		}

		console.info(service + ': ' + results.services[service].users.length);
	}

	process.exit(0);
};

var intercom = new Intercom(opts);
intercom.getTag({ name: 'actives' }, function (err, res) {
	handleError(err);

	console.info('Start getting intercom users..');
	intercom.getUsers({ tag_id: res.id, tagName: res.name }, function (err, res) {
		handleError(err);

		console.info(res.users.length + ' users loaded successfully.\n Start analysis..');

		res.users.forEach(function (user, index) {
			queue.push({ email: user.email }, function () {
				console.log('finshed processing user: ' + user.email);
			});
		});
	});
});

function handleError (err) {
	if (err) {
		util.print(util.inspect(err, { depth: 20 }));
		process.exit(1);
	}
}
