// load modules
const express = require('express');

const authUser = require('../middlewares/authUser');

const asyncHandler = require('../middlewares/asyncHandler');

const { User } = require('../models');

// Create the express router
const router = express.Router();

// [GET] [/api/users] route
router.get('/', authUser, (req, res) => {
	// Current logged in user 
	const user = req.currentUser;
	res.json(user);
});

// [POST] [/api/users] route
router.post(
	'/',
	asyncHandler(async (req, res, next) => {
		const { firstName, lastName, emailAddress, password } = req.body;
		try {
			await User.create({
				firstName,
				lastName,
				emailAddress,
				password,
			});
			res.status(201).location('/').end();
		} catch (error) {
			// Check if the error is coming from sequelize's "SequelizeValidationError" or SequelizeUniqueConstraintError
			const errorName = error.name;
			if (
				errorName === 'SequelizeValidationError' ||
				errorName === 'SequelizeUniqueConstraintError'
			) {
				const errors = error.errors.map((indivError) => indivError.message);
				res.status(400).json({ errors });
			} else {
				throw error;
			}
		}
	})
);

module.exports = router;
