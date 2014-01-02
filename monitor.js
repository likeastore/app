var respawn = require('respawn');

var monitor = respawn(['node', 'app.js'], {
	cwd: '.',
	maxRestarts: 10,
	sleep: 500,
});

monitor.on('spawn', function () {
	console.log('application monitor started...');
});

monitor.on('exit', function (code, signal) {
	console.log('process exited, code: ' + code + ' signal: ' + signal);
});

monitor.on('stdout', function (data) {
	console.log(data.toString());
});

monitor.on('stderr', function (data) {
	console.error(data.toString());
});

monitor.start();