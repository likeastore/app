var setupForms = {

	init: function () {
		$('.textInput').on('focus blur', function () {
			$(this).parent().toggleClass('active');
		});

		$('.form').submit(this.send.bind(this));
	},

	send: function (e) {
		e.stop();

		var $form = $(e.target),
			$email = $form.find('.email'),
			$name = $form.find('.username'),
			$pass = $form.find('.password');

		$form.find('.error').removeClass('error');
		$form.find('.error-message').remove();

		if (!$name.validate()) {
			handleErrors($name, 'These symbols in username are not allowed!');
			return;
		}

		if (!$email.validate()) {
			handleErrors($email, 'Your email looks incorrect!');
			return;
		}

		if (!$pass.validate()) {
			handleErrors($pass, 'Password contains not allowed symbols!');
			return;
		}

		$.post($form.attr('action'), $form.serializeObject())
			.done(function (res) {
				window.location = '/';
			})
			.fail(function (err) {
				handleErrors(err.responseText);
			});

		function handleErrors ($field, message) {
			var value = $field.val(),
				msg = value.length < 1 ? 'This field is empty..' : message;

			$field.addClass('error');
			$form.append('<div class="error-message">' + msg + '</div>');
		}
	}
};

$(function () {
	setupForms.init();
});
