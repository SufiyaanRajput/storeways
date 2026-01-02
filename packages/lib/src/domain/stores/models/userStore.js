module.exports = (sequelize, DataTypes) => {
	const UserStore = sequelize.define('UserStore', {
		id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: true,
			autoIncrement: true,
		},
		userId: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
		storeId: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references: { model: 'stores', key: 'id' },
		},
		deletedAt: {
			type: DataTypes.DATE,
			allowNull: true,
		},
		createdAt: {
			type: DataTypes.DATE,
			allowNull: false,
		},
		updatedAt: {
			type: DataTypes.DATE,
			allowNull: false,
		},
		active: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
			defaultValue: true,
		},
	}, {
		underscored: true,
		timestamps: true,
	});

	UserStore.associate = models => {
		UserStore.belongsTo(models.Store, { foreignKey: 'storeId' });
	};

	return UserStore;
};

