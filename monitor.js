var respawn = require('respawn');
var util = require('util');
var logger = require('./source/utils/logger');

function monitor(mode) {
	var proc = respawn(['node', 'app.js'], {
		cwd: '.',
		maxRestarts: 10,
		sleep: 1000,
	});

	proc.on('spawn', function () {
		util.print('application monitor started...');
	});

	proc.on('exit', function (code, signal) {
		logger.fatal({msg: 'process exited, code: ' + code + ' signal: ' + signal});
	});

	proc.on('stdout', function (data) {
		util.print(data.toString());
	});

	proc.on('stderr', function (data) {
		logger.error({msg: 'process error', data: data.toString()});
	});

	return proc;
}

[monitor()].forEach(function (m) {
	m.start();
});

