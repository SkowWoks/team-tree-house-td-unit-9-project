'use strict';

// load modules
const { Model } = require('sequelize');
const bcrypt = require('bcryptjs');

// Export [User] model
module.exports = (sequelize, DataTypes) => {
	class User extends Model {
		// Association
		static associate({ Course }) {
			// A user can have many courses
			this.hasMany(Course, {
				foreignKey: {
					type: DataTypes.INTEGER,
					name: 'userId',
					allowNull: false,
					validate: {
						notNull: {
							msg: 'userId is a required field',
						},
						notEmpty: {
							msg: 'userId can not be empty',
						},
					},
				},
				as: 'courses',
				hooks: true,
				onDelete: 'CASCADE',
			});
		}
	}
	User.init(
		{
			firstName: {
				type: DataTypes.STRING,
				allowNull: false,
				validate: {
					notNull: {
						msg: 'firstName is a required field',
					},
					notEmpty: {
						msg: 'firstName can not be empty',
					},
				},
			},
			lastName: {
				type: DataTypes.STRING,
				allowNull: false,
				validate: {
					notNull: {
						msg: 'lastName is a required field',
					},
					notEmpty: {
						msg: 'lastName can not be empty',
					},
				},
			},
			emailAddress: {
				type: DataTypes.STRING,
				allowNull: false,
				unique: true,
				validate: {
					notNull: {
						msg: 'emailAddress is a required field',
					},
					isEmail: {
						msg: 'Please provide a valid emailAddress',
					},
				},
			},
			password: {
				type: DataTypes.STRING,
				allowNull: false,
				validate: {
					notNull: {
						msg: 'password is a required field',
					},
					notEmpty: {
						msg: 'password can not be empty',
					},
					len: {
						args: [8, 20],
						msg: 'Password length must be between 8 to 20 characters long',
					},
				},
			},
		},
		{
			sequelize,
			modelName: 'User',
		}
	);

	User.afterValidate((user) => {
		const hashedPassword = bcrypt.hashSync(user.password, 10);
		user.password = hashedPassword;
	});
	return User;
};
