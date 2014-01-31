process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var util = require('util');
var async = require('async');
var config = require('../config');

var db = require('../source/db')(config);

var results = [];

var queue = async.queue(function (data, callback) {
	db.networks.find({ user: data.email }, function (err, networks) {
		if (err) {
			console.dir(util.inspect(err, { depth: 6 }));
			process.exit(1);
		}

		var userData = {
			user: data.email,
			count: networks.length,
			networks: networks
		};

		results.push(userData);
		callback();
	});
});

queue.drain = function () {
	if (process.argv[2] === '--print') {
		util.print(util.inspect(results, { depth: 20 }));
		console.log('\n');
	}

	var moreNetworks = [], lessNetworks = [];

	results.forEach(function (row, i) {
		if (row.count >= 5) {
			moreNetworks.push(row);
		}

		if (row.count < 5) {
			lessNetworks.push(row);
		}
	});

	console.log('ALL STATS:\n wow! >= 5 networks: ' + moreNetworks.length + '\n only < 5  networks: ' + lessNetworks.length);
	process.exit(0);
};

db.users.find().forEach(function (err, user) {
	if (err) {
		console.dir(util.inspect(err, { depth: 6 }));
		process.exit(1);
	}

	if (!user || !user.email) {
		return;
	}

	queue.push({ email: user.email }, function () {
		console.log('finshed processing user: ' + user.email);
	});
});
