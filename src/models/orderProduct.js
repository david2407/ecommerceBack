'use strict';
module.exports = (sequelize, DataTypes) => {
  var OrderProduct = sequelize.define(
    'OrderProduct',
    {
      idOrder: DataTypes.BIGINT,
      idProduct: DataTypes.BIGINT,
      quantity: DataTypes.BIGINT
    },
    {}
  );
  OrderProduct.associate = models => {
    OrderProduct.belongsTo(models.Order, {
      foreignKey: 'idOrder'
    });
    OrderProduct.belongsTo(models.Product, {
      foreignKey: 'idProduct'
    });
  };
  return OrderProduct;
};
