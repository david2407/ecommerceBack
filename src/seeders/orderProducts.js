'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      'OrderProducts',
      [
        {
          idOrder: 1,
          idProduct: 1,
          quantity: 2,
          createdAt: 'now()',
          updatedAt: 'now()'
        },
        {
          idOrder: 1,
          idProduct: 2,
          quantity: 5,
          createdAt: 'now()',
          updatedAt: 'now()'
        }
      ],
      {}
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('OrderProducts', null, {});
  }
};
