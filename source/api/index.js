module.exports = function (app) {
	require('./items')(app);
	require('./networks')(app);
	require('./users')(app);
};