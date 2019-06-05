'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      'Carts',
      [
        {
          userId: 1,
          state: 'Activo',
          createdAt: 'now()',
          updatedAt: 'now()'
        },
        {
          userId: 2,
          state: 'Activo',
          createdAt: 'now()',
          updatedAt: 'now()'
        }
      ],
      {}
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Carts', null, {});
  }
};
