// Middleware for handling route that uses async await
const asyncHandler = (cb) => {
	return async (req, res, next) => {
		try {
			await cb(req, res, next);
		} catch (error) {
			next(error);
		}
	};
};

module.exports = asyncHandler;
