'use strict';

// /** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
    await queryInterface.bulkInsert('product_bids', [
      {
        product_id: 1,
        price: 100,
        currency: 'USD',
        user_id: 1,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        product_id: 2,
        price: 150,
        currency: 'USD',
        user_id: 2,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        product_id: 3,
        price: 200,
        currency: 'USD',
        user_id: 3,
        created_at: new Date(),
        updated_at: new Date(),
      }
    ])
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
