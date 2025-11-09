const { Sequelize } = require('sequelize');

async function up({ context: queryInterface }) {
  await queryInterface.addColumn(
    'stores',
    'domain',
    {
      type: Sequelize.DataTypes.STRING,
      allowNull: true,
    }
  );
}

async function down({ context: queryInterface }) {}

module.exports = { up, down };
