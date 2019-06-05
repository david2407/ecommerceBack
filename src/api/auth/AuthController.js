const crypto = require('crypto');
const bcrypt = require('bcrypt');

const { sendEmail, getAdminUrl } = require('../../utils/util');
const AuthService = require('../../services/AuthService');
const models = require('../../models');
const { InvalidArguments, BusinessLogicError } = require('../../utils/errors');
const { SALT_ROUNDS, LOCALES } = require('../../constants/constants');
const { getRoleData } = require('../../utils/util');
const errors = require('../../constants/errors');
const { franchiseEmails, brandEmails, userEmails } = require('../../constants/emails');

const generateRandomHash = () => {
  const currentDate = new Date().valueOf().toString();
  const random = Math.random().toString();
  return crypto
    .createHash('sha1')
    .update(currentDate + random)
    .digest('hex');
};

const signupUser = async (req, res) => {
  try {
    const email = req.body.email;
    const pass = req.body.password;
    const fullName = req.body.fullName;

    const token = await AuthService.signupUser(email, pass, fullName);
    res.json({ accessToken: token });
  } catch (err) {
    if (err.code && err.code === 11000) {
      res.status(400).send({ error: errors.FOUND_USER });
    } else {
      const msg = err.errmsg ? err.errmsg : err.message ? err.message : '';

      if (msg) {
        res.status(400).send({ error: msg });
      } else {
        res.status(400).send({ error: err });
      }
    }
  }
};

const loginUser = async (req, res) => {
  try {
    const email = req.body.email;
    const pass = req.body.password;
    const sbadmin = req.body.sbadmin === true ? req.body.sbadmin : false;

    const userr = await AuthService.loginUser(email, pass, sbadmin);
    res.json({ user: userr });
  } catch (err) {
    const msg = err.errmsg ? err.errmsg : err.message ? err.message : '';

    if (msg) {
      res.status(400).send({ error: msg });
    } else {
      res.status(400).send({ error: err });
    }
  }
};

const forgotPassword = async (req, res) => {
  try {
    const email = req.body.email;

    if (!email) {
      throw new InvalidArguments(errors.INVALID_EMAIL);
    }

    const userExist = await models.User.findOne({ where: { email } });
    if (!userExist) {
      throw new BusinessLogicError(errors.NOT_FOUND_USER);
    }
    const hash = generateRandomHash();
    userExist.hash = hash;
    await userExist.save();

    const emailData = {
      name: userExist.name,
      resetPassUrl: `${getAdminUrl()}/reset-password?hash=${hash}`
    };

    await sendEmail(userExist.email, userEmails.resetPassword(userExist.locale, emailData));

    res.json(true);
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
};

const resetPassword = async function(req, res) {
  try {
    const hash = req.body.hash;
    const password = req.body.password;

    if (!hash) {
      throw new InvalidArguments(errors.INVALID_HASH);
    }

    const user = await models.User.findOne({
      where: { hash },
      include: [
        {
          model: models.Brand,
          through: {
            attributes: ['role']
          }
        },
        {
          model: models.Franchise,
          through: {
            attributes: ['role']
          }
        }
      ]
    });

    if (!user) {
      throw new BusinessLogicError(errors.NOT_FOUND_HASH);
    }

    const hashedNewPassword = bcrypt.hashSync(password, SALT_ROUNDS);
    user.password = hashedNewPassword;
    user.hash = null;
    user.hashExpiredDate = null;
    await user.save();

    if (user.lastSeen === null) sendConfirmEmail(user);

    res.send('Success');
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
};

const sendConfirmEmail = async user => {
  let emailData = {};
  const userData = getRoleData(user);
  if (userData.isFranchise) {
    const franchise = await models.Franchise.findByPk(userData.franchiseId, {
      attributes: ['name'],
      include: {
        model: models.Brand,
        attributes: ['logo', 'subDomain'],
        include: {
          model: models.User,
          attributes: ['name', 'email', 'locale']
        }
      }
    });

    emailData = {
      name: franchise.Brand.Users[0].name,
      franchiseName: franchise.name,
      brandLogo: franchise.Brand.logo.transforms.filter(f => f.id === 'small')[0].location,
      subDomain: franchise.Brand.subDomain
    };
    await sendEmail(
      franchise.Brand.Users[0].email,
      franchiseEmails.confirm(franchise.Brand.Users[0].locale, emailData)
    );
  }
  if (userData.isBrand) {
    const brand = await models.Brand.findByPk(userData.brandId);

    emailData = {
      brandName: brand.name,
      brandLogo: brand.logo.transforms.filter(f => f.id === 'small')[0].location,
      subDomain: brand.subDomain
    };

    await sendEmail('info@franager.com', brandEmails.confirm(LOCALES.EN, emailData));
  }
};

const createResetPasswordEmail = async function(req, res) {
  try {
    const email = req.query.email;

    await AuthService.createResetPasswordEmail(email);
    res.json({ msg: 'ok' });
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
};

const createExchangeToken = async function(userId, admin = false) {
  const randomHash = generateRandomHash();
  const accessToken = await AuthService.signToken(userId);

  const ex = await models.ExchangeToken.create({ code: randomHash, accessToken: accessToken });
  if (admin) {
    return `${process.env.URL_PROTOCOL}${process.env.ADMIN_URL}/redirect?code=${ex.code}`;
  }
  return `${process.env.URL_PROTOCOL}${process.env.SITE_URL}/redirect?code=${ex.code}`;
};

const exchangeToken = async function(req, res) {
  try {
    if (!req.body.code) {
      res.status(400).send({
        error: errors.INVALID_TOKEN,
        code: 10002,
        message: errors.INVALID_TOKEN
      });
      return;
    }

    const etd = await models.ExchangeToken.findOne({ where: { code: req.body.code } });
    if (!etd) {
      res.status(400).send({
        error: 'The code ' + req.body.code + ' is invalid, please signup again',
        code: 10002,
        message: 'The code ' + req.body.code + ' is invalid, please signup again'
      });
      return;
    }

    etd.destroy();
    res.status(200).send({ token: etd.accessToken });
  } catch (err) {
    res.status(400).send({ error: errors.UNEXPECTED_ERROR });
  }
};

module.exports = {
  exchangeToken,
  createExchangeToken,
  createResetPasswordEmail,
  resetPassword,
  loginUser,
  signupUser,
  forgotPassword,
  generateRandomHash
};
