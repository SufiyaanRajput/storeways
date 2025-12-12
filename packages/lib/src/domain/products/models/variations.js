module.exports = (sequelize, DataTypes) => {
  const Variation = sequelize.define('Variation', {
		id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    options: {
      type: DataTypes.JSON,
      allowNull: false
    },
    deletedAt: {
      type: DataTypes.DATE,
      allowNull: true
    },
    createdAt: {
      type: DataTypes.DATE
    },
    updatedAt: {
      type: DataTypes.DATE
    },
    active: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
			defaultValue: true
		},
    categoryId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'categories',
        key: 'id'
      }
    },
    storeId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'store',
        key: 'id'
      }
    }
	}, {
    underscored: true,
		timestamps: true
  });

  Variation.associate = models => {
    Variation.belongsTo(models.Category, {
      as: 'category'
    });
  };

	return Variation;
};