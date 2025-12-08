module.exports = (sequelize, DataTypes) => {
  const Store = sequelize.define('Store', {
    id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			autoIncrement: true,
			primaryKey: true
		},
		name: {
			type: DataTypes.STRING,
			allowNull: false
		},
		domain: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    subDomain: {
			type: DataTypes.STRING,
			allowNull: false,
			unique: true,
		},
    activeTheme: {
			type: DataTypes.STRING,
			allowNull: false,
			defaultValue: 'classic'
		},
    logo: {
			type: DataTypes.JSON,
			allowNull: true
		},
    termsOfService: {
			type: DataTypes.TEXT,
			allowNull: true
		},
    privacyPolicy: {
			type: DataTypes.TEXT,
			allowNull: true
		},
    socialLinks: {
			type: DataTypes.JSON,
			allowNull: true
		},
    settings: {
      type: DataTypes.JSON,
      allowNull: false
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
		timestamps: true
  });

	return Store;
};