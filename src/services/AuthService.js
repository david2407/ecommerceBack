const jwt = require('jsonwebtoken');
const expressJwt = require('express-jwt');
const compose = require('composable-middleware');
const bcrypt = require('bcrypt');
const moment = require('moment');
const models = require('../models');
const { SALT_ROUNDS } = require('../constants/constants');
const { ADMIN_ROLES } = require('../constants/roles');
const { getRoleData } = require('../utils/util');
const errors = require('../constants/errors');

const { InvalidArguments, ShouldBeAdmin, BusinessLogicError } = require('../utils/errors');

const validateJwt = expressJwt({
  secret: process.env.JWT_SECRET
});

const signupUser = async (email, password) => {
  if (!email) {
    throw new InvalidArguments(errors.INVALID_EMAIL);
  }
  if (!password) {
    throw new InvalidArguments(errors.INVALID_PASSWORD);
  }

  const userExist = await models.User.findOne({ where: { email } });
  if (userExist) {
    throw new InvalidArguments(errors.FOUND_EMAIL);
  }
  const hashedPassword = bcrypt.hashSync(password, SALT_ROUNDS);

  const user = await models.User.create({
    email,
    password: hashedPassword
  });
  const token = await signToken(user.id);
  return token;
};

const loginUser = async (email, password, sbadmin = false) => {
  if (!email) {
    throw new InvalidArguments(errors.INVALID_EMAIL);
  }
  if (!password) {
    throw new InvalidArguments(errors.INVALID_PASSWORD);
  }

  let user = await models.User.findOne({
    where: { email }
  });

  if (!user) {
    throw new BusinessLogicError(errors.NOT_FOUND_EMAIL);
  }

  if (!user.password) {
    throw new InvalidArguments(errors.INVALID_PASSWORD_LOGIN_GOOGLE);
  }

  const passValid = bcrypt.compareSync(password, user.password || '');
  if (!passValid) {
    throw new BusinessLogicError(errors.NOT_FOUND_PASSWORD);
  }

  return user;
};

/**
 * Attaches the user object to the request if authenticated
 * Otherwise returns 403
 */
const isAuthenticated = () => {
  return (
    compose()
      // Validate jwt
      .use((req, res, next) => {
        // Allow access_token to be passed through query parameter as well
        if (req.query && req.query.hasOwnProperty('access_token')) {
          req.headers.authorization = 'Bearer ' + req.query.access_token;
        }
        validateJwt(req, res, next);
      })
      // Attach user to request
      .use((req, res, next) => {
        models.User.findOne({
          where: { id: req.user.id },
          attributes: { exclude: ['password'] },
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
              },
              include: [
                {
                  model: models.Brand,
                  attributes: ['subDomain']
                }
              ]
            }
          ]
        })
          .then(user => {
            if (!user) {
              return res.status(401).send('Unauthorized');
            }
            user = getRoleData(user, true);
            req.user = user;
            req['jwt'] = signToken(user.id);
            next();
            return null;
          })
          .catch(err => {
            next(err);
          });
      })
  );
};

const canSeeAdmin = () => {
  return (
    compose()
      // Validate jwt
      .use((req, res, next) => {
        // Allow access_token to be passed through query parameter as well
        if (req.query && req.query.hasOwnProperty('access_token')) {
          req.headers.authorization = 'Bearer ' + req.query.access_token;
        }

        validateJwt(req, res, next);
      })
      // Attach user to request
      .use((req, res, next) => {
        models.User.findOne({
          where: { id: req.user.id },
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
        })
          .then(user => {
            user = getRoleData(user, true);
            if (!user || !ADMIN_ROLES.includes(user.role)) {
              return res.status(401).send('Unauthorized');
            }

            req.user = user;
            req['jwt'] = signToken(user.id);
            next();
            return null;
          })
          .catch(err => {
            next(err);
          });
      })
  );
};
/**
 * Returns a jwt token signed by the app secret, token expires in 1 year
 */
const signToken = (id, role) => {
  const jwtSecret = process.env.JWT_SECRET;
  return new Promise(resolve => {
    resolve(
      jwt.sign({ id: id }, jwtSecret, {
        expiresIn: '' + 1000 * 60 * 60 * 24 * 365
      })
    );
  });
};

const checkAccess = where => {
  return compose().use((req, res, next) => {
    if (check(req.user.role, where)) {
      next();
    } else {
      next({ message: errors.NO_ACCESS });
    }
  });
};

const check = (role, action, data) => {
  const permissions = rules[role];
  if (!permissions) {
    // role is not present in the rules
    return false;
  }

  const staticPermissions = permissions.static;
  // not perform need
  if (!action) {
    return true;
  }

  if (staticPermissions && staticPermissions.includes(action)) {
    // static rule not provided for action
    return true;
  }

  const dynamicPermissions = permissions.dynamic;

  if (dynamicPermissions) {
    const permissionCondition = dynamicPermissions[action];
    if (!permissionCondition) {
      // dynamic rule not provided for action
      return false;
    }

    return permissionCondition(data);
  }
  return false;
};

module.exports = {
  isAuthenticated,
  canSeeAdmin,
  signToken,
  signupUser,
  loginUser,
  checkAccess
};
