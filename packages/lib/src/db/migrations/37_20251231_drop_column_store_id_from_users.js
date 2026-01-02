const { Sequelize } = require('sequelize');

async function up({ context: queryInterface }) {
	await queryInterface.removeColumn('users', 'store_id');
}

async function down({ context: queryInterface }) {
	await queryInterface.addColumn('users', 'store_id', {
		type: Sequelize.INTEGER,
		allowNull: true,
		references: { model: 'stores', key: 'id' },
	});
}

module.exports = { up, down };

