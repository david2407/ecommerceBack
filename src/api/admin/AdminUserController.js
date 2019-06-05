const bcrypt = require('bcrypt');

const models = require('../../models');
const { SALT_ROUNDS } = require('./../../constants/constants');
const { InvalidArguments, BusinessLogicError } = require('../../utils/errors');
const errors = require('../../constants/errors');
const getUsers = async (req, res) => {
  let page = req.query.page;
  const limit = req.query.limit;
  const order = req.query.order || 'ASC';

  try {
    const total = await models.User.count();
    const users = await models.User.findAll({
      order: [['name', order]]
    });
    res.json({
      docs: users,
      total,
      page: Number(page),
      limit: Number(limit)
    });
  } catch (err) {
    res.status(400).send({ error: err.message, code: 400, message: err.message });
  }
};

const getUserById = async (req, res) => {
  try {
    const userId = req.params.user_id;

    if (!userId) {
      throw new InvalidArguments(errors.INVALID_USER_ID);
    }

    const user = await models.User.findByPk(userId);
    res.json(user);
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
};

const editUserInfo = async (req, res) => {
  try {
    const userId = req.params.user_id;
    const userData = req.body.data;

    if (!userId) {
      throw new InvalidArguments(errors.INVALID_USER_ID);
    }

    let user = await models.User.findByPk(userId);

    if (user.password !== userData.password) {
      userData.password = bcrypt.hashSync(userData.password, SALT_ROUNDS);
    }

    user = await models.User.update(userData, {
      where: { id: userId }
    }).then(async () => {
      const userData = await models.User.findByPk(userId);
      return userData;
    });
    res.json(user);
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
};

const changeUserPassword = async (req, res) => {
  try {
    const userId = req.user.id;

    if (!req.body.currentPassword) throw new InvalidArguments(errors.INVALID_PASSWORD);
    if (!req.body.newPassword) throw new InvalidArguments(errors.INVALID_NEW_PASSWORD);

    const user = await models.User.findByPk(userId);

    const passValid = bcrypt.compareSync(req.body.currentPassword, user.password);

    if (!passValid) {
      throw new BusinessLogicError(errors.NOT_FOUND_PASSWORD);
    }
    const hashedNewPassword = bcrypt.hashSync(req.body.newPassword, SALT_ROUNDS);

    user.password = hashedNewPassword;
    await user.save();

    res.json(user);
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
};

const searchEmail = async (req, res) => {
  try {
    const email = req.query.email;

    if (!email) {
      throw new InvalidArguments(errors.INVALID_EMAIL);
    }

    const userExist = await models.User.findOne({ where: { email } });

    if (!userExist) {
      res.json({ exist: false });
    } else {
      res.json({ exist: true });
    }
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
};

module.exports = { getUsers, getUserById, editUserInfo, changeUserPassword, searchEmail };
