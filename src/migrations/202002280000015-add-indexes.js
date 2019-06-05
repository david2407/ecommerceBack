'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface
      .addIndex('Users', ['id'])
      .then(() => queryInterface.addIndex('Users', ['email']))
      .then(() => queryInterface.addIndex('Users', ['createdAt']))
      .then(() => queryInterface.addIndex('Users', ['updatedAt']));
  },
  down: (queryInterface, Sequelize) => {
    return Promise.resolve();
  }
};
