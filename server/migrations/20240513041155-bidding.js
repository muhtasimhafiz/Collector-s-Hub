'use strict';

const { it } = require("node:test");
const sequelize = require("sequelize");

// /** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */

    await queryInterface.createTable('product_bids', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      product_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'products',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      user_id: {
        type: sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
      },
      status: {
        type:sequelize.ENUM('pending', 'accepted', 'rejected'),
        allowNull:false,
        defaultValue:'pending'
      },
      // item_id: {
      //   type: Sequelize.INTEGER,
      //   allowNull: false,
      //   references: {
      //     model: 'items',
      //     key: 'id',
      //   },
      //   onUpdate: 'CASCADE',
      //   onDelete: 'CASCADE',
      // },
      price: {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: false,
    },
      currency: {
      type: Sequelize.STRING,
      allowNull: false,
    },
      created_at: {
      type: Sequelize.DATE,
      allowNull: false,
    },
      updated_at: {
      type: Sequelize.DATE,
      allowNull: false,
    },
      deleted_at: {
      type: Sequelize.DATE,
      allowNull: true,
    },
      deleted_at: {
      type: Sequelize.DATE,
      allowNull: true,
    },
      updated_by: {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
      created_by: {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
    })

},

  async down(queryInterface, Sequelize) {
  /**
   * Add reverting commands here.
   *
   * Example:
   * await queryInterface.dropTable('users');
   */

  await queryInterface.dropTable('product_bids')

}
};
