module.exports = function (items, last) {
	if (!last) {
		return items;
	}

	if (items[0].itemId === last.itemId) {
		return null;
	}

	var newItems = [];
	for (var i = 0; i < items.length; i++) {
		if (items[i].itemId === last.itemId) {
			return newItems;
		}

		newItems.push(items[i]);
	}

	return newItems;
};