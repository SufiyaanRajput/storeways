const { Sequelize } = require('sequelize');

async function up({ context: queryInterface }) {
  await queryInterface.addColumn(
    'orders',
    'meta_data',
    {
      type: Sequelize.JSON,
      allowNull: true,
    }
  );
}

async function down({ context: queryInterface }) {
  await queryInterface.removeColumn('orders', 'meta_data');
}

module.exports = { up, down };

