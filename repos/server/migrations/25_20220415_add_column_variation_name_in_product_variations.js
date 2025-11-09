const { Sequelize } = require('sequelize');

async function up({ context: queryInterface }) {
  await queryInterface.addColumn(
    'product_variations',
    'variation_name',
    {
      type: Sequelize.STRING,
      allowNull: false,
    }
  );
}

async function down({ context: queryInterface }) {}

module.exports = { up, down };