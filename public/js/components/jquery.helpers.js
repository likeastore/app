(function ($) {
	$.Event.prototype.stop = function () {
		this.stopPropagation();
		this.preventDefault();
	};

	$.fn.validate = function () {
		var $target = $(this);
		var regex = $target.hasClass('email') ? /^([\w.-]+)@([\w-]+)((.(\w){2,3})+)$/i : /^[0-9A-z-_.+=@!#()&%?]+$/;

		return regex.test($target.val());
	};

	$.fn.serializeObject = function () {
		var object = {};
		var array = this.serializeArray();

		$.each(array, function() {
			if (object[this.name] !== undefined) {
				if (!object[this.name].push) {
					object[this.name] = [object[this.name]];
				}
				object[this.name].push(this.value || '');
			} else {
				object[this.name] = this.value || '';
			}
		});

		return object;
	};
})(jQuery);