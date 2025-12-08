const { Sequelize } = require('sequelize');

async function up({ context: queryInterface }) {
  await queryInterface.addColumn(
    'orders',
    'variations',
    {
      type: Sequelize.JSON,
      allowNull: true,
    }
  );

  await queryInterface.addColumn(
    'orders',
    'is_suspicious',
    {
      type: Sequelize.BOOLEAN,
      allowNull: true,
    }
  );

  await queryInterface.addColumn(
    'orders',
    'quantity',
    {
      type: Sequelize.INTEGER,
      allowNull: false,
    }
  );
}

async function down({ context: queryInterface }) {}

module.exports = { up, down };