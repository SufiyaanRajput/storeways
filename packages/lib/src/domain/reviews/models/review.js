module.exports = (sequelize, DataTypes) => {
	const Review = sequelize.define('Review', {
	id: {
		type: DataTypes.INTEGER,
		allowNull: false,
		primaryKey: true,
		autoIncrement: true,
	  },
	  productId: {
		type: DataTypes.INTEGER,
		allowNull: false,
	  },
	  userId: {
		type: DataTypes.INTEGER,
		allowNull: true,
	  },
	  storeId: {
		type: DataTypes.INTEGER,
		allowNull: false,
		},
	  content: {
		type: DataTypes.TEXT,
		allowNull: false,
	  },
	  ratings: {
		type: DataTypes.DECIMAL(1,3),
		allowNull: true,
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
	  }
	  }, {
	  underscored: true,
		  timestamps: true
	});
  
	  return Review;
  };