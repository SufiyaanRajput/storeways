const { Sequelize } = require('sequelize');

async function up({ context: queryInterface }) {
  await queryInterface.addColumn(
    'products',
    'images',
    {
      type: Sequelize.JSON,
      allowNull: true,
    }
  );
}

async function down({ context: queryInterface }) {}

module.exports = { up, down };