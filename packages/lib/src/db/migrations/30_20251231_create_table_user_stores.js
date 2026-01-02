const { Sequelize } = require('sequelize');

async function up({ context: queryInterface }) {
	await queryInterface.createTable('user_stores', {
		id: {
			type: Sequelize.INTEGER,
			allowNull: false,
			autoIncrement: true,
			primaryKey: true,
		},
		user_id: {
			type: Sequelize.INTEGER,
			allowNull: false,
		},
		store_id: {
			type: Sequelize.INTEGER,
			allowNull: false,
			references: { model: 'stores', key: 'id' },
		},
		deleted_at: {
			type: Sequelize.DATE,
			allowNull: true,
		},
		created_at: {
			type: Sequelize.DATE,
			allowNull: false,
		},
		updated_at: {
			type: Sequelize.DATE,
			allowNull: false,
		},
		active: {
			type: Sequelize.BOOLEAN,
			allowNull: false,
			defaultValue: true,
		},
	});
}

async function down({ context: queryInterface }) {
	await queryInterface.dropTable('user_stores');
}

module.exports = { up, down };

