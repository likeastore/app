var config = require('../../config');
var ga = require('nodealytics');
ga.initialize(config.ga.id, config.ga.domain);

module.exports = ga;