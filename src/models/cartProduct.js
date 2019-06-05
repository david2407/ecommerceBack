'use strict';
module.exports = (sequelize, DataTypes) => {
  var CartProduct = sequelize.define(
    'CartProduct',
    {
      idCart: DataTypes.BIGINT,
      idProduct: DataTypes.BIGINT,
      quantity: DataTypes.BIGINT
    },
    {}
  );
  CartProduct.associate = models => {
    CartProduct.belongsTo(models.Cart, {
      foreignKey: 'idCart'
    });
    CartProduct.belongsTo(models.Product, {
      foreignKey: 'idProduct'
    });
  };
  return CartProduct;
};
