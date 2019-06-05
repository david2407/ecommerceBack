const { InvalidArguments } = require('../../utils/errors');
const models = require('../../models');
const errors = require('../../constants/errors');

const me = async (req, res) => {
  try {
    res.json(req.user);
  } catch (err) {
    res.status(400).send({ error: err.message, code: 400, message: err.message });
  }
};

const update = async (req, res) => {
  try {
    const userId = req.user.id;
    const userData = req.body.data;

    if (!userId) {
      throw new InvalidArguments(errors.INVALID_USER_ID);
    }
    const user = await models.User.update(userData, { where: { id: userId } });
    res.json(user);
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
};

module.exports = { me, update };
