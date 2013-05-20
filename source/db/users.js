var _ = require('underscore');
var grvtr = require('grvtr');
var bcrypt = require('bcrypt-nodejs');
var ObjectId = require('mongojs').ObjectId;
var db = require('./dbConnector').db;
var util = require('util');

// fields from user metadata of diff services
var metaFromServices = ['id', 'provider', 'username', 'displayName'];


function findById(id, callback) {
	db.users.findOne({ _id: new ObjectId(id) }, function (err, user) {
		if (err) {
			return callback(err);
		}

		callback(null, user);
	});
}

/*
 * Looks for account in db with 2 keys 'id' and 'provider' type
 * Adds new user if does not exist
 * @param token {String} - service token
 * @param tokenSecret {String} - optional secret token
 * @param profile {Object} - passport.js data adopted from service API
 */

function findOrCreateByService (token, tokenSecret, profile, callback) {
	db.users.findOne({ id: profile.id, provider: profile.provider }, function (err, user) {
		if (err) {
			return callback(err);
		}

		if (user) {
			return callback(null, user);
		}

		saveServiceUser();
	});

	function saveServiceUser () {
		var meta = _.pick(profile, metaFromServices);
		var avatar = profile._json.avatar_url || profile._json.profile_image_url || util.format('http://graph.facebook.com/%s/picture', meta.id);
		var record = _.extend(meta, {
			token: token,
			tokenSecret: tokenSecret,
			avatar: avatar,
			name: profile.username,
			registered: new Date(),
			firstTimeUser: true
		});

		db.users.save(record, function (err, saved) {
			if (err || !saved) {
				return callback(err);
			}
			callback(null, saved);
		});
	}
}

/*
 * Local register
 * @param data {Object} - request body, e.g. { username, email, password }
 */
function findOrCreateLocal (data, callback) {
	db.users.findOne({ username: data.username, provider: 'local' }, function (err, user) {
		if (err) {
			return callback(err);
		}

		if (user) {
			bcrypt.compare(data.password, user.password, function (err, res) {
				if (err) {
					return(err);
				}

				if (!res) {
					return callback('Username and password do not match!');
				}

				return callback(null, user);
			});
		} else {
			saveLocalUser();
		}

		function saveLocalUser() {
			var gravatar_url = grvtr.create(data.email, { defaultImage: 'mm' });
			var record = {
				name: data.username,
				email: data.email,
				avatar: gravatar_url,
				provider: 'local',
				registered: new Date()
			};

			bcrypt.genSalt(10, function (err, salt) {
				if (err) {
					return callback(err);
				}

				bcrypt.hash(data.password, salt, null, function (err, hash) {
					if (err) {
						return callback(err);
					}

					record.password = hash;
					db.users.save(record, function (err, saved) {
						if (err) {
							return callback(err);
						}

						callback(null, saved);
					});
				});
			});
		}
	});
}

/*
 * Mandatory first time user setup
 * @param userId {Object} - mongo ObjectId()
 * @param data {Object} - form fields
 */
function accountSetup (userId, data, callback) {

	db.users.findOne({
		_id: { $ne: new ObjectId(userId) }, $or: [{username: data.username}, {email: data.email }]
	}, function (err, user) {
		if (err) {
			return callback(err);
		}

		if (user && user.username === data.username) {
			return callback({field: 'username',  message: 'User with such username already exists.'});
		}

		if (user && user.email === data.email) {
			return callback({field: 'email', message:'User with such email already exists.'});
		}

		db.users.update(
			{ _id: new ObjectId(userId) },
			{ $set: { name: data.username, email: data.email }, $unset: { firstTimeUser: 1 }},
			updatedUser);

		function updatedUser (err) {
			if (err) {
				return callback(err);
			}

			callback(null);
		}
	});
}

module.exports = {
	findById: findById,
	findOrCreateLocal: findOrCreateLocal,
	findOrCreateByService: findOrCreateByService,
	accountSetup: accountSetup
};