module.exports = (sequelize, DataTypes) => {
  const Order = sequelize.define('Order', {
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
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    productVariationStockId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'productVariationStocks',
        key: 'id'
      }
    },
    storeId: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references: { model: 'stores', key: 'id' }
		},
    amount: {
      type: DataTypes.DECIMAL(100,2),
      allowNull: false,
    },
    price: {
      type: DataTypes.DECIMAL(100,2),
      allowNull: false,
    },
    amountPaid: {
      type: DataTypes.DECIMAL(100,2),
      allowNull: false,
    },
    source: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    paymentMode: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    referenceId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    internalStatus: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'internal_status',
    },
    deliveryStatus: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
		variations: {
      type: DataTypes.JSON,
      allowNull: true,
    },
		quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
		isSuspicious: {
			type: DataTypes.BOOLEAN,
			allowNull: true,
		},
    metaData: {
      type: DataTypes.JSON,
      allowNull: true,
      field: 'meta_data',
    },
    charges: {
			type: DataTypes.JSON,
			allowNull: false,
		},
    cartReferenceId: {
			type: DataTypes.STRING(17),
			allowNull: false,
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

  // Associations are defined after all models are initialized
  Order.associate = (models) => {
    Order.belongsTo(models.Product, { foreignKey: 'productId' });
    Order.belongsTo(models.User, { foreignKey: 'userId' });
    Order.belongsTo(models.ProductVariationStock, { foreignKey: 'productVariationStockId' });
  };

	return Order;
};