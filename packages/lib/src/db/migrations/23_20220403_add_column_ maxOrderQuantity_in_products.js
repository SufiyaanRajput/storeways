const { Sequelize } = require('sequelize');

async function up({ context: queryInterface }) {
  await queryInterface.addColumn(
    'products',
    'max_order_quantity',
    {
      type: Sequelize.INTEGER,
      allowNull: true,
    }
  );
}

async function down({ context: queryInterface }) {}

module.exports = { up, down };