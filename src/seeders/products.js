'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      'Products',
      [
        {
          name: 'Reloj',
          stock: 3,
          categoryId: 5,
          price: 30000,
          createdAt: 'now()',
          updatedAt: 'now()'
        },
        {
          name: 'Patineta',
          stock: 8,
          categoryId: 5,
          price: 90000,
          createdAt: 'now()',
          updatedAt: 'now()'
        },
        {
          name: 'Motocicleta',
          stock: 8,
          categoryId: 6,
          price: 75000,
          createdAt: 'now()',
          updatedAt: 'now()'
        },
        {
          name: 'Pulsera',
          stock: 8,
          categoryId: 6,
          price: 40000,
          createdAt: 'now()',
          updatedAt: 'now()'
        },
        {
          name: 'Camiseta',
          stock: 8,
          categoryId: 5,
          price: 110000,
          createdAt: 'now()',
          updatedAt: 'now()'
        }
      ],
      {}
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Products', null, {});
  }
};
