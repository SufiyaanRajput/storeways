module.exports = (sequelize, DataTypes) => {
  const Product = sequelize.define('Product', {
		id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    returnPolicy: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    price: {
      type: DataTypes.DECIMAL(100,2),
      allowNull: false,
    },
    stock: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    sku: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    maxOrderQuantity: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    images: {
      type: DataTypes.JSON,
      defaultValue: [],
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    storeId: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references: { model: 'stores', key: 'id' }
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

  Product.hasMany(sequelize.models.ProductVariationStock, {as: 'productVariationStocks'});

	return Product;
};