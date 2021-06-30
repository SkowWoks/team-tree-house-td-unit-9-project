// Middleware for if route not found
const routeNotFound = (req, res, next) => {
	const error = new Error('Route not found!');
	error.status = 404;
	next(error);
};

// Middleware for custom error handler
const customErrorHandler = (enableGlobalErrorLogging) => {
	return (error, req, res, next) => {
		if (enableGlobalErrorLogging) {
			console.error(
				'\x1b[31m%s\x1b[0m',
				`Global error handler: ${JSON.stringify(err.stack)}`
			);
		}

		const errorMessage = error.message || 'Oops, server error!';
		const errorStatus = error.status || 500;
		const errorStack = error.stack || 'No error stack!';

		res.status(errorStatus).json({
			status: errorStatus,
			message: errorMessage,
			stack: process.env.NODE_ENV === 'development' ? errorStack : '',
		});
	};
};

module.exports = {
	routeNotFound,
	customErrorHandler,
};
