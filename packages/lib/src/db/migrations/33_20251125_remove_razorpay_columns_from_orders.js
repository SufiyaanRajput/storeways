const { Sequelize } = require('sequelize');

async function up({ context: queryInterface }) {
  await queryInterface.removeColumn('orders', 'razorpay_payment_id');
  await queryInterface.removeColumn('orders', 'razorpay_order_id');
  await queryInterface.removeColumn('orders', 'razorpay_signature');
}

async function down({ context: queryInterface }) {
  await queryInterface.addColumn('orders', 'razorpay_payment_id', {
    type: Sequelize.TEXT,
    allowNull: true,
  });
  await queryInterface.addColumn('orders', 'razorpay_order_id', {
    type: Sequelize.TEXT,
    allowNull: true,
  });
  await queryInterface.addColumn('orders', 'razorpay_signature', {
    type: Sequelize.TEXT,
    allowNull: true,
  });
}

module.exports = { up, down };


