'use strict';

// load modules
const express = require('express');
const morgan = require('morgan');

const { routeNotFound, customErrorHandler } = require('./middlewares/errors');

const db = require('./models');

// Load routes
const usersRoute = require('./routes/users');
const coursesRoute = require('./routes/courses');

// variable to enable global error logging
const enableGlobalErrorLogging =
	process.env.ENABLE_GLOBAL_ERROR_LOGGING === 'true';

// create the Express app
const app = express();

// setup morgan which gives us http request logging
app.use(morgan('dev'));

// use json format body
app.use(express.json());

// server error testing
// app.use((req, res, next) => {
// 	const error = new Error();
// 	error.status = 500;
// 	next(error);
// });

// test sequelize connection
(async () => {
	try {
		await db.sequelize.authenticate();
		console.log(
			'\x1b[32m%s\x1b[0m',
			'Database connection has been established...'
		);

		await db.sequelize.sync();
		console.log(
			'\x1b[32m%s\x1b[0m',
			'All models were synchronized successfully!'
		);
	} catch (error) {
		console.log(
			'\x1b[31m%s\x1b[0m',
			'Sorry, looks like there is a problem connecting to database!'
		);
		console.error(
			'\x1b[31m%s\x1b[0m',
			`Connecting to database error: ${error}`
		);
	}
})();

// setup a friendly greeting for the root route
app.get('/', (req, res) => {
	res.json({
		message: 'Welcome to the REST API project!',
	});
});

// Routes
app.use('/api/users',usersRoute);
app.use('/api/courses',coursesRoute);

// send 404 if no other route matched
app.use(routeNotFound);

// setup a global error handler
app.use(customErrorHandler(enableGlobalErrorLogging));

// set our port
app.set('port', process.env.PORT || 5000);

// start listening on our port
const server = app.listen(app.get('port'), () => {
	console.log(`Express server is listening on port ${server.address().port}`);
});
