const bcrypt = require('bcryptjs');
const { default: defaultStoreSettings } = require('../src/services/users/defaultStoreSettings');

  async function up({ context: queryInterface }) {
    const now = new Date();
    const [store] = await queryInterface.bulkInsert(
      'stores',
      [
        {
          name: 'My Awesome Store',
          domain: null,
          sub_domain: 'store',
          active_theme: 'classic',
          terms_of_service: 'These are demo terms of service.',
          privacy_policy: 'This is a demo privacy policy.',
          settings: JSON.stringify(defaultStoreSettings),
          active: true,
          created_at: now,
          updated_at: now,
          deleted_at: null,
        },
      ],
      { returning: ['id'] } // for Postgres; ensures we get inserted ID
    );

    console.log('created-store', store)

    const passwordHash = await bcrypt.hash('password123', 8);

    await queryInterface.bulkInsert('users', [
      {
        name: 'Test User',
        mobile: '9999999999',
        password: passwordHash,
        role: 'owner',              // valid enum: 'owner' | 'admin' | 'customer'
        store_id: store.id,             // optional FK; set if you have a store record
        email: 'dummy@example.com',
        address: '123 Example Street',
        landmark: 'Near Central Park',
        pincode: '400001',
        active: true,
        created_at: new Date(),
        updated_at: new Date(),
        deleted_at: null
      },
    ]);
  }
  
  async function down({ context: queryInterface }) {
    await queryInterface.bulkDelete('stores');
    await queryInterface.bulkDelete('users');
  }
  
  module.exports = { up, down };
