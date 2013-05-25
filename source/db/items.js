var db = require('./dbConnector').db;

function getAllItems (userId, callback) {
	db.items.find({ userId: userId }).toArray(function (err, items) {
		if (err) {
			return callback(err);
		}

		items.sort(sortByDateHelper);
		callback(null, items);
	});
}

function getItemsByType (userId, type, callback) {
	db.items.find({ userId: userId, type: type }).toArray(function (err, items) {
		if (err) {
			return callback(err);
		}

		items.sort(sortByDateHelper);
		callback(null, items);
	});
}

// sorts from latest to oldest date
function sortByDateHelper (item1, item2) {
	var date1 = item1.date;
	var date2 = item2.date;

	return date1 > date2 ? -1 : (date1 < date2 ? 1 : 0);
}

module.exports = {
	getAllItems: getAllItems,
	getItemsByType: getItemsByType
};