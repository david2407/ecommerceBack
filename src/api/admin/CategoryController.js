const models = require('../../models');
const getCategories = async (req, res) => {
  const order = req.query.order || 'ASC';

  try {
    const total = await models.User.count();
    const categories = await models.Category.findAll({
      order: [['name', order]]
    });
    res.json({
      docs: categories,
      total
    });
  } catch (err) {
    res.status(400).send({ error: err.message, code: 400, message: err.message });
  }
};

module.exports = { getCategories };
