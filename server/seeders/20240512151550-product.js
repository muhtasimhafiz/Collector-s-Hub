'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('products', [{
      seller_id: 1,
      status: 'active',
      bidding: false,
      price: 100.00,
      ratings: 5,
      quantity: 10,
      currency: 'USD',
      deleted: false,
      created_at: new Date(),
      updated_at: new Date(),
      name: 'Product 1',
      image: 'image_url'
      // Add other fields as necessary
    }, {
      seller_id: 2,
      status: 'active',
      bidding: false,
      price: 200.00,
      ratings: 4,
      quantity: 20,
      currency: 'USD',
      deleted: false,
      created_at: new Date(),
      updated_at: new Date(),
      name: 'Product 2',
      image: 'image_url'
      // Add other fields as necessary
    }], {});
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('products', null, {});
  }
};