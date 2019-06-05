
const models = require('../../models');
const getCarts = async (req, res) => {
  try {
    const total = await models.User.count();
    const users = await models.Cart.findAll({
    });
    res.json({
      docs: users,
      total
    });
  } catch (err) {
    res.status(400).send({ error: err.message, code: 400, message: err.message });
  }
};

const getCartById = async (req, res) => {
  try {
    const cartId = req.params.cartId;

    const cartProducts = await models.CartProduct.findAll({
      where: { idCart: cartId },
      include: [
        {
          model: models.Cart,
          attributes: ['id', 'userId', 'state']
        },
        {
          model: models.Product,
          attributes: ['id', 'name', 'price']
        }
      ]
    });
    res.json(cartProducts);
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
};

const editCart = async (req, res) => {
  try {
    const cartId = req.params.cartId;
    const Data = req.body.data;

    let cart = await models.Cart.findByPk(cartId);

    cart = await models.Cart.update(Data, {
      where: { id: cartId }
    }).then(async () => {
      const Data = await models.User.findByPk(cartId);
      return Data;
    });
    res.json(cart);
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
};

module.exports = { getCarts, getCartById, editCart };
