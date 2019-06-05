const models = require('../../models');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;


const getProducts = async (req, res) => {
  try {
    const total = await models.Product.count();
    const products = await models.Product.findAll({
      order: [['name', 'ASC']],
      include: [
        {
          model: models.Category,
          attributes: ['name']
        }]
    });
    res.json({
      docs: products,
      total
    });
  } catch (err) {
    res.status(400).send({ error: err.message, code: 400, message: err.message });
  }
};

const getProductById = async (req, res) => {
  try {
    const productId = req.params.productId;

    const product = await models.Product.findByPk(productId);
    res.json(product);
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
};

module.exports = { getProducts, getProductById };
