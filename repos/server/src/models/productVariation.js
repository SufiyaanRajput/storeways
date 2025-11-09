module.exports = (sequelize, DataTypes) => {
  const ProductVariation = sequelize.define('ProductVariation', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    productId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'products',
        key: 'id'
      }
    },
    option: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    variationName: {
			type: DataTypes.STRING,
			allowNull: false,
		},
    deletedAt: {
      type: DataTypes.DATE,
      allowNull: true
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false
    },
    active: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
			defaultValue: true
		}
	}, {
    underscored: true,
		timestamps: true
  });

	return ProductVariation;
};