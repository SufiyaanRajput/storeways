const { Sequelize } = require('sequelize');

async function up({ context: queryInterface }) {
  await queryInterface.addColumn(
    'orders',
    'price',
    {
      type: Sequelize.DataTypes.DECIMAL(100,2),
      allowNull: false,
    }
  );

  await queryInterface.addColumn(
    'orders',
    'amount_paid',
    {
      type: Sequelize.DataTypes.DECIMAL(100,2),
      allowNull: false,
    }
  );
}

async function down({ context: queryInterface }) {}

module.exports = { up, down };
