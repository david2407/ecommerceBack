'use strict';
module.exports = (sequelize, DataTypes) => {
  var Category = sequelize.define(
    'Category',
    {
      name: DataTypes.STRING,
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE
    },
    {}
  );
  // User.associate = models => {

  // };
  return Category;
};
