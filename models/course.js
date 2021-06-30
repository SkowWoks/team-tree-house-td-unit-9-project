'use strict';

// load modules
const { Model } = require('sequelize');

// Export [Course] model
module.exports = (sequelize, DataTypes) => {
	class Course extends Model {
		// Association
		static associate({ User }) {
			// A course belongs to a user
			this.belongsTo(User, {
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
				as: 'user',
			});
		}
	}
	Course.init(
		{
			title: {
				type: DataTypes.STRING,
				allowNull: false,
				validate: {
					notNull: {
						msg: 'title is a required field',
					},
					notEmpty: {
						msg: 'title can not be empty',
					},
				},
			},
			description: {
				type: DataTypes.TEXT,
				allowNull: false,
				validate: {
					notNull: {
						msg: 'description is a required field',
					},
					notEmpty: {
						msg: 'description can not be empty',
					},
				},
			},
			estimatedTime: {
				type: DataTypes.STRING,
				validate: {
					notEmpty: {
						msg: 'estimatedTime can not be empty',
					},
				},
			},
			materialsNeeded: {
				type: DataTypes.STRING,
				validate: {
					notEmpty: {
						msg: 'materialsNeeded can not be empty',
					},
				},
			},
		},
		{
			sequelize,
			modelName: 'Course',
		}
	);
	return Course;
};
