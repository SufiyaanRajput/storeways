const { Sequelize } = require('sequelize');

async function up({ context: queryInterface }) {
  await queryInterface.addColumn(
    'orders',
    'product_variation_stock_id',
    {
      type: Sequelize.INTEGER,
      references: {
        model: 'product_variation_stocks',
        key: 'id'
      }
    }
  );
}

async function down({ context: queryInterface }) {}

module.exports = { up, down };