async function up({ context: queryInterface }) {
  await queryInterface.sequelize.query(`ALTER TYPE enum_users_role ADD VALUE 'customer';`)
}

async function down({ context: queryInterface }) {}

module.exports = { up, down };