// load modules
const auth = require('basic-auth');
const bcrypt = require('bcryptjs');

const { User } = require('../models');

// Middleware for authenticate user and return authenticated user data
const authUser = async (req, res, next) => {
	const nameAndPass = auth(req);

	if (nameAndPass) {
		if (nameAndPass.name !== '' && nameAndPass.pass !== '') {
			const user = await User.findOne({
				where: { emailAddress: nameAndPass.name },
				attributes: ['id', 'firstName', 'lastName', 'password'],
			});
			if (user) {
				const passwordMatched = bcrypt.compareSync(
					nameAndPass.pass,
					user.password
				);
				if (passwordMatched) {
					const userId = user.id;
					const userFirstName = user.firstName;
					const userLastName = user.lastName;
					const currentUser = {
						userId,
						userFirstName,
						userLastName,
					};
					req.currentUser = currentUser;
					next();
				} else {
					res.status(401).json({
						status: 'Unauthorized',
						message: 'User not found',
					});
				}
			} else {
				res.status(401).json({
					status: 'Unauthorized',
					message: 'User not found',
				});
			}
		} else {
			res.status(401).json({
				status: 'Unauthorized',
				message: 'Please provide your username and password',
			});
		}
	} else {
		res.status(401).json({
			status: 'Unauthorized',
			message: 'Auth header not found',
		});
	}
};

module.exports = authUser;
