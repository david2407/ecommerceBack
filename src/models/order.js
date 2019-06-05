'use strict';
module.exports = (sequelize, DataTypes) => {
  var Order = sequelize.define(
    'Order',
    {
      userId: DataTypes.BIGINT,
      total: DataTypes.FLOAT
    },
    {}
  );
  Order.associate = models => {
    Order.belongsTo(models.User, {
      foreignKey: 'userId'
    });
  };
  return Order;
};
