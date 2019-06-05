'use strict';
module.exports = (sequelize, DataTypes) => {
  var Cart = sequelize.define(
    'Cart',
    {
      userId: DataTypes.BIGINT,
      state: DataTypes.STRING
    },
    {}
  );
  Cart.associate = models => {
    Cart.belongsTo(models.User, {
      foreignKey: 'userId'
    });
  };
  return Cart;
};
