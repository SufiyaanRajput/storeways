const { Sequelize } = require('sequelize');

async function up({ context: queryInterface }) {
  await queryInterface.addColumn(
    'users',
    'address',
    {
      type: Sequelize.TEXT,
      allowNull: true,
    }
  );

  await queryInterface.addColumn(
    'users',
    'landmark',
    {
      type: Sequelize.TEXT,
      allowNull: true,
    }
  );

  await queryInterface.addColumn(
    'users',
    'pincode',
    {
      type: Sequelize.STRING,
      allowNull: true,
    }
  );
}

async function down({ context: queryInterface }) {}

module.exports = { up, down };