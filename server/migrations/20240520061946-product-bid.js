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
    await queryInterface.createTable('product_bids', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement:true
      },
      product_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'products',
          key: 'id'
        }
      },
      user_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'users',
          key: 'id'
        }
      },
      bid_price: {
        type: Sequelize.INTEGER
      },
      status: {
        type: Sequelize.ENUM('pending', 'approved', 'rejected'),
        defaultValue: 'pending'
      },
      currency: {
        type: Sequelize.STRING(10),
        allowNull: true
      },

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
    await queryInterface.dropTable('product_bids');
  }
};
