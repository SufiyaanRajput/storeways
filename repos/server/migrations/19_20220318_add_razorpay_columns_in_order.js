const { Sequelize } = require('sequelize');

async function up({ context: queryInterface }) {
  await queryInterface.addColumn(
    'orders',
    'razorpay_payment_id',
    {
      type: Sequelize.TEXT,
      allowNull: true,
    }
  );

  await queryInterface.addColumn(
    'orders',
    'razorpay_order_id',
    {
      type: Sequelize.TEXT,
      allowNull: true,
    }
  );

  await queryInterface.addColumn(
    'orders',
    'razorpay_signature',
    {
      type: Sequelize.TEXT,
      allowNull: true,
    }
  );
}

async function down({ context: queryInterface }) {}

module.exports = { up, down };