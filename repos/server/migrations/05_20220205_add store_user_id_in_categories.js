const { Sequelize } = require('sequelize');

async function up({ context: queryInterface }) {
  await queryInterface.addColumn(
    'categories',
    'store_id',
    {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'stores',
        key: 'id'
      }
    }
  )
}

async function down({ context: queryInterface }) {}

module.exports = { up, down };