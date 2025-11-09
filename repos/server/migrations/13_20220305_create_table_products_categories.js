const { Sequelize } = require('sequelize');

async function up({ context: queryInterface }) {
	await queryInterface.createTable('product_categories', {
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
    category_id: {
			type: Sequelize.INTEGER,
			allowNull: false,
			references: { model: 'categories', key: 'id' }
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

  await queryInterface.removeColumn(
    'products',
    'category_id'
  );
}

async function down({ context: queryInterface }) {
	await queryInterface.dropTable('product_categories');
}

module.exports = { up, down };