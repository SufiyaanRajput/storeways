const { Sequelize } = require('sequelize');

async function up({ context: queryInterface }) {
	await queryInterface.createTable('users', {
		id: {
			type: Sequelize.INTEGER,
			allowNull: false,
			autoIncrement: true,
			primaryKey: true
		},
		name: {
			type: Sequelize.STRING,
			allowNull: false
		},
    mobile: {
			type: Sequelize.STRING,
			allowNull: false
		},
    password: {
			type: Sequelize.STRING,
			allowNull: false
		},
    role: {
			type: Sequelize.ENUM({
				values: ['owner', 'admin']
			}),
			allowNull: false
		},
		active: {
			type: Sequelize.BOOLEAN,
			allowNull: false,
			defaultValue: true
		},
		store_id: {
			type: Sequelize.INTEGER,
			allowNull: true,
			references: { model: 'stores', key: 'id' }
		},
		created_at: {
			type: Sequelize.DATE,
			allowNull: false
		},
		updated_at: {
			type: Sequelize.DATE,
			allowNull: false
		},
		deleted_at: {
			type: Sequelize.DATE,
			allowNull: true
		}
	});
}

async function down({ context: queryInterface }) {
	await queryInterface.dropTable('users');
}

module.exports = { up, down };