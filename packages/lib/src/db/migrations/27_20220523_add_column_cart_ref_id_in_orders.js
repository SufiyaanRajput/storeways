const { Sequelize } = require('sequelize');

async function up({ context: queryInterface }) {
  await queryInterface.addColumn(
    'orders',
    'cart_reference_id',
    {
      type: Sequelize.STRING(17),
      allowNull: false,
    }
  );
}

async function down({ context: queryInterface }) {}

module.exports = { up, down };