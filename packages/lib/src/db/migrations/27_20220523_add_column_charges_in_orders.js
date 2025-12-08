const { Sequelize } = require('sequelize');

async function up({ context: queryInterface }) {
  await queryInterface.addColumn(
    'orders',
    'charges',
    {
      type: Sequelize.JSON,
      allowNull: false,
    }
  );
}

async function down({ context: queryInterface }) {}

module.exports = { up, down };