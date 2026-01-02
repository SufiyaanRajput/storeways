module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
		id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			autoIncrement: true,
			primaryKey: true,
		},
		name: {
			type: DataTypes.STRING,
			allowNull: false
		},
    mobile: {
			type: DataTypes.STRING,
			allowNull: false
		},
    password: {
			type: DataTypes.STRING,
			allowNull: true
		},
    role: {
			type: DataTypes.ENUM({
				values: ['owner', 'admin', 'customer']
			}),
			allowNull: false
		},
		email: {
			type: DataTypes.TEXT,
			allowNull: false
		},
		address: {
			type: DataTypes.TEXT,
			allowNull: true
		},
		landmark: {
			type: DataTypes.TEXT,
			allowNull: true
		},
		pincode: {
			type: DataTypes.TEXT,
			allowNull: true
		},
		active: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
			defaultValue: true
		},
		createdAt: {
			type: DataTypes.DATE,
			allowNull: false
		},
		updatedAt: {
			type: DataTypes.DATE,
			allowNull: false
		},
		deletedAt: {
			type: DataTypes.DATE,
			allowNull: true
		}
	}, {
    underscored: true,
	timestamps: true,
  });

	return User;
};