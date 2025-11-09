async function up({ context: queryInterface }) {
  await queryInterface.sequelize.query(`ALTER TABLE stores ALTER COLUMN logo TYPE json USING (logo::json);`)
}

async function down({ context: queryInterface }) {}

module.exports = { up, down };