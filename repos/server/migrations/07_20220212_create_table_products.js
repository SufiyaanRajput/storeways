const { Sequelize } = require('sequelize');

async function up({ context: queryInterface }) {
	await queryInterface.createTable('products', {
		id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    sku: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    category_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'categories',
        key: 'id'
      }
    },
    store_id: {
			type: Sequelize.INTEGER,
			allowNull: false,
			references: { model: 'stores', key: 'id' }
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
    },
    active: {
			type: Sequelize.BOOLEAN,
			allowNull: false,
			defaultValue: true
		}
	});
}

async function down({ context: queryInterface }) {
	await queryInterface.dropTable('products');
}

module.exports = { up, down };