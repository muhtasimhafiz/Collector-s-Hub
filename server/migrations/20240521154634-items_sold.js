'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */

    await queryInterface.createTable("items_sold", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      product_id: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      buyer_id: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      quantity: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      total_price: {
        type: Sequelize.FLOAT,
        allowNull: false
      },

      product_bid_id: {
        type: Sequelize.INTEGER,
        allowNull: true
      },

      // bidding:{
      //   type: Sequelize.BOOLEAN,
      //   defaultValue: false
      // },


      deleted: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      deleted_at: {
        type: Sequelize.DATE,
        allowNull: true
      },
      deleted_by: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      created_by: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: true
      },
      updated_by: {
        type: Sequelize.INTEGER,
        allowNull: true
      }
    },
    )
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await que
     * ryInterface.dropTable('users');
     */

    await queryInterface.dropTable("items_sold");
  }
};
