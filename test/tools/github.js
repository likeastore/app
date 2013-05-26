var items = require('./../../source/db/items');

items.getItemsByType('519dfc8b3605cec5a2000005', 'github', function (err, items) {
	console.log(items[0]);
});