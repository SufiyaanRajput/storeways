async function up({ context: queryInterface }) {
  await queryInterface.sequelize.query(`ALTER TABLE users ALTER password DROP NOT NULL;`)
}

async function down({ context: queryInterface }) {}

module.exports = { up, down };