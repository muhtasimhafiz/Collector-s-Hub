'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('products_join_categories', [{
      product_id: 1,
      category_id: 1,
    }, {
      product_id: 2,
      category_id: 2,
    }], {});
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('products_join_categories', null, {});
  }
};