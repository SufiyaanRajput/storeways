const { Sequelize } = require('sequelize');

async function up({ context: queryInterface }) {
	await queryInterface.createTable('reviews', {
		id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    product_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'products',
        key: 'id'
      }
    },
    user_id: {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    store_id: {
			type: Sequelize.INTEGER,
			allowNull: false,
			references: { model: 'stores', key: 'id' }
		},
    content: {
      type: Sequelize.TEXT,
      allowNull: false,
    },
    ratings: {
      type: Sequelize.DECIMAL(2,1),
      allowNull: true,
    },
    deleted_at: {
      type: Sequelize.DATE,
      allowNull: true
    },
    created_at: {
      type: Sequelize.DATE,
      allowNull: false
    },
    updated_at: {
      type: Sequelize.DATE,
      allowNull: false
    }
	});
}

async function down({ context: queryInterface }) {
	await queryInterface.dropTable('reviews');
}

module.exports = { up, down };