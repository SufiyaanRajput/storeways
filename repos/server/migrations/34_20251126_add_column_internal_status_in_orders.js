const { Sequelize } = require('sequelize');

async function up({ context: queryInterface }) {
  await queryInterface.addColumn(
    'orders',
    'internal_status',
    {
      type: Sequelize.STRING,
      allowNull: true,
    }
  );
}

async function down({ context: queryInterface }) {}

module.exports = { up, down };


