module.exports = (sequelize, DataTypes) => {
  const Category = sequelize.define('Category', {
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
    storeId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'stores',
        key: 'id'
      }
    },
    parentId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'categories',
        key: 'id'
      }
    }
	}, {
    underscored: true,
		timestamps: true
  });

  Category.associate = models => {
    Category.hasMany(models.Variation, {
      as: 'variations',
      foreignKey: 'categoryId'
    });
  };

	return Category;
};