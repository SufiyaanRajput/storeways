const { Sequelize } = require('sequelize');

async function up({ context: queryInterface }) {
  await queryInterface.addColumn(
    'orders',
    'delivery_status',
    {
      type: Sequelize.DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    }
  );
}

async function down({ context: queryInterface }) {}

module.exports = { up, down };
