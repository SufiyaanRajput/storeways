const { Sequelize } = require('sequelize');

async function up({ context: queryInterface }) {
  await queryInterface.addColumn(
    'products',
    'return_policy',
    {
      type: Sequelize.TEXT,
      allowNull: true,
    }
  );

  await queryInterface.addColumn(
    'products',
    'price',
    {
      type: Sequelize.DECIMAL(100,2),
      allowNull: false,
    }
  );

  await queryInterface.addColumn(
    'products',
    'stock',
    {
      type: Sequelize.INTEGER,
      allowNull: false,
    }
  );
}

async function down({ context: queryInterface }) {}

module.exports = { up, down };