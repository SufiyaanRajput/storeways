const { Sequelize } = require('sequelize');

async function up({ context: queryInterface }) {
  await queryInterface.addColumn('product_variation_stocks', 'images', {
    type: Sequelize.JSON,
    allowNull: true,
  });
}

async function down({ context: queryInterface }) {
  await queryInterface.removeColumn('product_variation_stocks', 'images');
}

module.exports = { up, down };

