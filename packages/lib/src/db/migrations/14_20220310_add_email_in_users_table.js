const { Sequelize } = require('sequelize');

async function up({ context: queryInterface }) {
  await queryInterface.addColumn(
    'users',
    'email',
    {
      type: Sequelize.TEXT,
      allowNull: false,
    }
  )
}

async function down({ context: queryInterface }) {}

module.exports = { up, down };