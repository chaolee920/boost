
module.exports = function(app) {

	// ROUTES FOR OUR API
	// =============================================================================

	// middleware to use for all requests

	app.use(function(req, res, next) {
		// do logging
		res.header("Access-Control-Allow-Origin", "*");
		res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
		res.header("Access-Control-Allow-Methods", "PUT, POST, GET, PATCH, DELETE");
		next();
	});

	app.use('/api/users', require('./api/users'));
	app.use('/api/promos', require('./api/promos'));
	app.use('/api/restaurants', require('./api/restaurants'));
	app.use('/api/subscribes', require('./api/subscribes'));
	app.use('/api/sales', require('./api/sales'));
	app.use('/api/ranks', require('./api/ranks'));
	app.use('/api/surveys', require('./api/surveys'));
};
