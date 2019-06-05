
const models = require('../../models');
const getOrders = async (req, res) => {
  try {
    const total = await models.Order.count();
    const orders = await models.Order.findAll({
    });
    res.json({
      docs: orders,
      total
    });
  } catch (err) {
    res.status(400).send({ error: err.message, code: 400, message: err.message });
  }
};

const getOrderById = async (req, res) => {
  try {
    const orderId = req.params.orderId;

    const orderProducts = await models.OrderProduct.findAll({
      where: { idOrder: orderId },
      include: [
        {
          model: models.Order,
          attributes: []
        }
      ]
    });
    res.json(orderProducts);
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
};

const getOrderByUserId = async (req, res) => {
  try {
    const userId = req.params.userId;

    const orderProducts = await models.OrderProduct.findAll({
      include: [
        {
          model: models.Order,
          where: { userId: userId },
          attributes: ['userId', 'total']
        }
      ]
    });
    res.json(orderProducts);
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
};

const createOrder = async (req, res) => {
  try {
    const data = req.params.Order;

    const Order = await models.Order.create(data);
    const OrderProduct = await models.OrderProduct.create(data.product);

    res.json(Order);
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
};

module.exports = { getOrders, getOrderById, getOrderByUserId, createOrder };
