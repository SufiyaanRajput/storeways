const { Sequelize } = require('sequelize');

async function up({ context: queryInterface }) {
  await queryInterface.addColumn(
    'products',
    'description',
    {
      type: Sequelize.TEXT,
      allowNull: true,
    }
  )
}

async function down({ context: queryInterface }) {}

module.exports = { up, down };