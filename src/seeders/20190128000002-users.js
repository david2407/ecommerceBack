'use strict';

const bcrypt = require('bcrypt');
const { SALT_ROUNDS } = require('../constants/constants');

module.exports = {
  up: (queryInterface, Sequelize) => {
    const hashedPassword = bcrypt.hashSync('123456', SALT_ROUNDS);
    return queryInterface.bulkInsert(
      'Users',
      [
        {
          name: 'David Admin',
          email: 'davidcortes2407@gmail.com',
          password: hashedPassword,
          createdAt: 'now()',
          updatedAt: 'now()'
        },
        {
          name: 'Duvan Brand',
          email: 'duvanmonsa+brand@gmail.com',
          password: hashedPassword,
          createdAt: 'now()',
          updatedAt: 'now()'
        }
      ],
      {}
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Users', null, {});
  }
};
