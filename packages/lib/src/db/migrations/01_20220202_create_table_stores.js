const { Sequelize } = require('sequelize');

async function up({ context: queryInterface }) {
	await queryInterface.createTable('stores', {
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
    sub_domain: {
			type: Sequelize.STRING,
			unique: true,
			allowNull: false
		},
    active_theme: {
			type: Sequelize.STRING,
			allowNull: false
		},
    logo: {
			type: Sequelize.TEXT,
			allowNull: true
		},
    terms_of_service: {
			type: Sequelize.TEXT,
			allowNull: true
		},
    privacy_policy: {
			type: Sequelize.TEXT,
			allowNull: true
		},
    social_links: {
			type: Sequelize.JSON,
			allowNull: true
		},
    settings: {
      type: Sequelize.JSON,
      allowNull: false
    },
		active: {
			type: Sequelize.BOOLEAN,
			allowNull: false,
			defaultValue: true
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
	await queryInterface.dropTable('stores');
}

module.exports = { up, down };