const { Sequelize } = require('sequelize');

async function up({ context: queryInterface }) {
	await queryInterface.createTable('auth_tokens', {
		id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    token: {
      type: Sequelize.TEXT,
      allowNull: false,
      unique: true
    },
    deleted_at: {
      type: Sequelize.DATE,
      allowNull: true
    },
    created_at: {
      type: Sequelize.DATE,
      allowNull: false
    },
    updated_at: {
      type: Sequelize.DATE,
      allowNull: false
    },
    active: {
			type: Sequelize.BOOLEAN,
			allowNull: false,
			defaultValue: true
		},
    user_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    }
	});
}

async function down({ context: queryInterface }) {
	await queryInterface.dropTable('auth_tokens');
}

module.exports = { up, down };