'use strict';
module.exports = (sequelize, DataTypes) => {
  var Product = sequelize.define(
    'Product',
    {
      name: DataTypes.STRING,
      stock: DataTypes.BIGINT,
      price: DataTypes.FLOAT,
      categoryId: DataTypes.BIGINT,
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE
    },
    {}
  );
  Product.associate = models => {
    Product.belongsTo(models.Category, {
      foreignKey: 'categoryId'
    });
  };
  return Product;
};
