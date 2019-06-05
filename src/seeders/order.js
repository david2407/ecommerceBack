'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      'Orders',
      [
        {
          userId: 1,
          total: 4000,
          createdAt: 'now()',
          updatedAt: 'now()'
        },
        {
          userId: 2,
          total: 5000,
          createdAt: 'now()',
          updatedAt: 'now()'
        }
      ],
      {}
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Orders', null, {});
  }
};
