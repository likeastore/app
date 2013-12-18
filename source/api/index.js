module.exports = function (app) {
	require('./auth')(app);
	require('./items')(app);
	require('./networks')(app);
	require('./users')(app);
	require('./search')(app);
	require('./inbox')(app);
};