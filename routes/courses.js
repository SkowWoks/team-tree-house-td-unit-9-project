// load modules
const express = require('express');

const authUser = require('../middlewares/authUser');

const asyncHandler = require('../middlewares/asyncHandler');

const { User, Course } = require('../models');

// Create the express router
const router = express.Router();

// [GET] [/api/courses] route
router.get(
	'/',
	asyncHandler(async (req, res, next) => {
		const courses = await Course.findAll({
			include: {
				model: User,
				as: 'user',
				attributes: { exclude: ['createdAt', 'updatedAt', 'password'] },
			},
			attributes: { exclude: ['createdAt', 'updatedAt'] },
		});
		res.json(courses);
	})
);

// [GET] [/api/courses/:id] route
router.get(
	'/:id',
	asyncHandler(async (req, res, next) => {
		const courseId = req.params.id;
		const course = await Course.findByPk(courseId, {
			include: {
				model: User,
				as: 'user',
				attributes: { exclude: ['createdAt', 'updatedAt', 'password'] },
			},
			attributes: { exclude: ['createdAt', 'updatedAt'] },
		});

		if (!course) {
			res.status(404).json({
				message: 'Course not found',
			});
		} else {
			res.json(course);
		}
	})
);

// [POST] [/api/courses] route
router.post(
	'/',
	authUser,
	asyncHandler(async (req, res, next) => {
		// Current logged in user 
		const user = req.currentUser;
		const { title, description, estimatedTime, materialsNeeded } = req.body;
		try {
			await Course.create({
				title,
				description,
				estimatedTime,
				materialsNeeded,
				userId: user.userId,
			});
			res.status(201).location('/').end();
		} catch (error) {
			// Check if the error is coming from sequelize's "SequelizeValidationError"
			const errorName = error.name;
			if (errorName === 'SequelizeValidationError') {
				const errors = error.errors.map((indiv) => indiv.message);
				res.status(400).json({ errors });
			} else {
				throw error;
			}
		}
	})
);

// [Put] [/api/courses/:id] route
router.put(
	'/:id',
	authUser,
	asyncHandler(async (req, res, next) => {
		// Current logged in user 
		const user = req.currentUser;
		const courseId = req.params.id;
		let {
			title,
			description,
			estimatedTime = null,
			materialsNeeded = null,
		} = req.body;

		// Check if "title" and "description" that was sent from client side is undefined
		if (title === undefined || description === undefined) {
			return res.status(400).json({
				message: 'title and description are required fields',
			});
		}

		try {
			const course = await Course.findByPk(courseId);

			if (!course) {
				res.status(404).json({
					message: 'Course not found',
				});
			} else {
				// Check if user is updating a course that he/she owns
				if (user.userId === course.userId) {
					await course.update({
						title,
						description,
						estimatedTime,
						materialsNeeded,
					});
					res.status(204).end();
				} else {
					res.status(403).json({
						status: 'Unauthorized',
						message: 'Course is not yours',
					});
				}
			}
		} catch (error) {
			// Check if the error is coming from sequelize's "SequelizeValidationError"
			const errorName = error.name;
			if (errorName === 'SequelizeValidationError') {
				const errors = error.errors.map((indiv) => indiv.message);
				res.status(400).json({ errors });
			} else {
				throw error;
			}
		}
	})
);

// [Delete] [/api/courses/:id] route
router.delete(
	'/:id',
	authUser,
	asyncHandler(async (req, res, next) => {
		// Current logged in user
		const user = req.currentUser;
		const courseId = req.params.id;

		try {
			const course = await Course.findByPk(courseId);
			if (!course) {
				res.status(404).json({
					message: 'Course not found',
				});
			} else {
				// Check if user is deleting a course that he/she owns
				if (user.userId === course.userId) {
					await course.destroy();
					res.status(204).end();
				} else {
					res.status(403).json({
						status: 'Unauthorized',
						message: 'Course is not yours',
					});
				}
			}
		} catch (error) {
			throw error;
		}
	})
);

module.exports = router;
