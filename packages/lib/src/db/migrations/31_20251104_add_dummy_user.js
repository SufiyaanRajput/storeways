const bcrypt = require('bcryptjs');
const { default: defaultStoreSettings } = require('../src/services/users/defaultStoreSettings');
const { createProduct } = require('../src/services/products');

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
 
    // ---- Seed demo category, variation, product, and variation stocks ----
    const [category] = await queryInterface.bulkInsert(
      'categories',
      [
        {
          name: 'Shoes',
          store_id: store.id,
          parent_id: null,
          active: true,
          created_at: now,
          updated_at: now,
          deleted_at: null,
        },
      ],
      { returning: ['id'] }
    );
    const categoryId = (category && (category.id || (Array.isArray(category) && category[0] && category[0].id))) || null;
 
    await queryInterface.bulkInsert('variations', [
      {
        name: 'Size',
        options: JSON.stringify(['3', '4', '5', '6', '7']),
        category_id: categoryId,
        store_id: store.id,
        active: true,
        created_at: now,
        updated_at: now,
        deleted_at: null,
      },
    ]);
 
    const sizes = ['3', '4', '5', '6', '7'];
    const unitPrice = '1999.00';
    const unitPriceBase = 1999; // numeric base for calculating per-variation price
    const priceIncrement = 20;  // small increment per size
    const priceForIndex = (i) => (unitPriceBase + i * priceIncrement).toFixed(2);
    const sizeStocks = sizes.map((s, i) => ({
      size: s,
      idx: i,
      stock: Math.floor(Math.random() * 16) + 5, // 5..20
    }));
    const totalStock = sizeStocks.reduce((sum, { stock }) => sum + stock, 0);
 
    // Create 5 demo products and attach provided images with variation mapping
    const imageSources = [
      { url: 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?q=80&w=998&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', alt: 'Shoe 1' },
      { url: 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?q=80&w=1064&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', alt: 'Shoe 2' },
      { url: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fHNob2VzfGVufDB8fDB8fHww', alt: 'Shoe 3' },
      { url: 'https://images.unsplash.com/photo-1605348532760-6753d2c43329?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MzJ8fHNob2VzfGVufDB8fDB8fHww', alt: 'Shoe 4' },
      { url: 'https://images.unsplash.com/photo-1550399865-ec7d23b18e8e?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NDR8fHNob2VzfGVufDB8fDB8fHww', alt: 'Shoe 5' },
    ];
    const productNames = [
      'Nike Air Max 270',
      'Nike Air Max 270 White',
      'Nike Air Max 270 Blue',
      'Nike Air Max 270 Black',
      'Nike Air Max 270 Runner',
    ];
    const skus = ['SHOE-001', 'SHOE-002', 'SHOE-003', 'SHOE-004', 'SHOE-005'];
    // Create 5 demo products using the application service (handles categories and variation stocks)
    for (let i = 0; i < productNames.length; i++) {
      await createProduct({
        categoryIds: [categoryId],
        name: productNames[i],
        sku: skus[i],
        price: unitPrice,
        stock: totalStock,
        returnPolicy: '30-day returns on unused items.',
        description: 'A demo shoe with sizes 3 to 7.',
        storeId: store.id,
        active: true,
        images: imageSources.map((src, j) => ({
          url: src.url,
          alt: src.alt,
          variation: { size: sizes[j] },
        })),
        variations: sizeStocks.map(({ size, stock, idx }) => ({
          maxOrderQuantity: null,
          price: priceForIndex(idx),
          stock,
          variationGroup: [{ name: 'Size', value: size }],
        })),
      });
    }
  }
  
  async function down({ context: queryInterface }) {
    // Clean product-related seed first
    const [[storeRow] = []] = await Promise.all([
      queryInterface.sequelize.query(`
        SELECT id FROM stores 
        WHERE sub_domain = 'store' AND deleted_at IS NULL 
        ORDER BY id DESC 
        LIMIT 1
      `),
    ]);
    const storeId = storeRow && storeRow.id;
 
    const [productRows] = await queryInterface.sequelize.query(`
      SELECT id, sku FROM products 
      WHERE sku IN ('SHOE-001','SHOE-002','SHOE-003','SHOE-004','SHOE-005') AND deleted_at IS NULL
    `);
    const productIds = Array.isArray(productRows) ? productRows.map((r) => r.id) : [];
 
    if (productIds.length && storeId) {
      await queryInterface.bulkDelete('product_variation_stocks', {
        product_id: productIds,
        store_id: storeId,
      });
    }
 
    if (productIds.length) {
      await queryInterface.bulkDelete('product_categories', {
        product_id: productIds,
      });
    }
 
    await queryInterface.bulkDelete('products', { sku: ['SHOE-001','SHOE-002','SHOE-003','SHOE-004','SHOE-005'] });
 
    if (storeId) {
      const [[categoryRow] = []] = await Promise.all([
        queryInterface.sequelize.query(`
          SELECT id FROM categories 
          WHERE name = 'Shoes' AND store_id = ${storeId} AND deleted_at IS NULL
          ORDER BY id DESC 
          LIMIT 1
        `),
      ]);
      const categoryId = categoryRow && categoryRow.id;
 
      await queryInterface.bulkDelete('variations', {
        name: 'Size',
        store_id: storeId,
        ...(categoryId ? { category_id: categoryId } : {}),
      });
 
      await queryInterface.bulkDelete('categories', {
        name: 'Shoes',
        store_id: storeId,
      });
    }
 
    // Finally remove the demo store and user
    await queryInterface.bulkDelete('stores');
    await queryInterface.bulkDelete('users');
  }
  
  module.exports = { up, down };
