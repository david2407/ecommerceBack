const { google } = require('googleapis');
const AuthController = require('./AuthController');
const models = require('../../models');
const { ADMIN_ROLES } = require('../../constants/roles');
const { BusinessLogicError } = require('./../../utils/errors');
const { getRoleData } = require('./../../utils/util');
const errors = require('../../constants/errors');

const oauth2Client = new google.auth.OAuth2(
  process.env.GMAIL_CLIENT_ID,
  process.env.GMAIL_CLIENT_SECRET,
  process.env.GMAIL_REDIRECT_URL
);

const oauth2ClientAdmin = new google.auth.OAuth2(
  process.env.GMAIL_CLIENT_ID,
  process.env.GMAIL_CLIENT_SECRET,
  process.env.GMAIL_ADMIN_REDIRECT_URL
);

const oauth2ClientAdminConnect = new google.auth.OAuth2(
  process.env.GMAIL_CLIENT_ID,
  process.env.GMAIL_CLIENT_SECRET,
  process.env.GMAIL_ADMIN_CONNECT_REDIRECT_URL
);

const scopes = ['https://www.googleapis.com/auth/userinfo.email', 'https://www.googleapis.com/auth/plus.me'];

const authorize = function(req, res) {
  const url = oauth2Client.generateAuthUrl({
    access_type: 'offline', // 'online' (default) or 'offline' (gets refresh_token)
    scope: scopes,
    redirect_uri: process.env.GMAIL_REDIRECT_URL
  });
  res.json(url + '&approval_prompt=force');
};

const authorizeAdmin = function(req, res) {
  const url = oauth2ClientAdmin.generateAuthUrl({
    access_type: 'offline', // 'online' (default) or 'offline' (gets refresh_token)
    scope: scopes,
    redirect_uri: process.env.GMAIL_ADMIN_REDIRECT_URL
  });
  res.redirect(url + '&approval_prompt=force');
};

const authorizeAdminConnect = async function(req, res) {
  const url = oauth2ClientAdmin.generateAuthUrl({
    access_type: 'offline', // 'online' (default) or 'offline' (gets refresh_token)
    scope: scopes,
    redirect_uri: process.env.GMAIL_ADMIN_CONNECT_REDIRECT_URL
  });
  res.redirect(url + '&approval_prompt=force');
};

const handleCallback = async function(req, res) {
  try {
    if (req.query.error && req.query.error === 'access_denied') {
      res.redirect(`${process.env.URL_PROTOCOL}${process.env.SITE_URL}/login?access_denied=true`);
      return;
    }
    const { tokens } = await oauth2Client.getToken(req.query.code);
    oauth2Client.setCredentials(tokens);

    const userData = (await google.plus('v1').people.get({ userId: 'me', auth: oauth2Client })).data;

    // Email used by the user on Gmail
    const email = userData.emails.filter(emailObj => {
      return emailObj.type === 'account';
    });

    // search a user with the google id
    let user = await models.User.findOne({
      where: {
        googleAuthId: userData.id
      }
    });

    if (!user) {
      // check if user with that email already exist
      user = await models.User.findOne({
        where: {
          email: email[0].value
        }
      });
      if (user) {
        res.redirect(`${process.env.URL_PROTOCOL}${process.env.ADMIN_URL}?email_already_exist=true`);
        return;
      }
      user = await models.User.create({
        name: userData.displayName,
        email: email[0].value,
        googleAuthId: userData.id,
        googleData: JSON.stringify(userData)
      });
    }
    await user.updateAttributes({
      googleData: JSON.stringify(userData),
      googleAuthId: userData.id
    });
    const urlAux = await AuthController.createExchangeToken(user.id);
    res.redirect(urlAux);
  } catch (err) {
    res.status(501).send(err);
  }
};

const handleCallbackAdmin = async function(req, res) {
  try {
    if (req.query.error && req.query.error === 'access_denied') {
      res.redirect(`${process.env.URL_PROTOCOL}${process.env.ADMIN_URL}/redirect?access_denied=true`);
      return;
    }

    const { tokens } = await oauth2ClientAdmin.getToken(req.query.code);
    oauth2ClientAdmin.setCredentials(tokens);

    const userData = (await google.plus('v1').people.get({ userId: 'me', auth: oauth2ClientAdmin })).data;

    // Email used by the user on Gmail

    const email = userData.emails.filter(emailObj => {
      return emailObj.type === 'account';
    });

    // search a user with the google id
    let user = await models.User.findOne({
      where: {
        googleAuthId: userData.id
      },
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
      // check if user with that email already exist
      user = await models.User.findOne({
        where: {
          email: email[0].value
        }
      });
      if (user) {
        res.redirect(`${process.env.URL_PROTOCOL}${process.env.ADMIN_URL}/redirect?email_already_exist=true`);
        return;
      }

      user = await models.User.create({
        name: userData.displayName,
        email: email[0].value,
        googleAuthId: userData.id,
        googleData: JSON.stringify(userData)
      });

      user.Franchises = [];
      user.Brands = [];
    }

    if (!ADMIN_ROLES.includes(getRoleData(user, true).role)) {
      res.redirect(`${process.env.URL_PROTOCOL}${process.env.ADMIN_URL}/redirect?access_denied=true`);
      return;
    }

    await user.updateAttributes({
      googleData: JSON.stringify(userData),
      googleAuthId: userData.id
    });

    const urlAux = await AuthController.createExchangeToken(user.id, true);

    res.redirect(urlAux);
  } catch (err) {
    res.status(501).send(err);
  }
};

const handleCallbackAdminConnect = async function(req, res) {
  try {
    const { tokens } = await oauth2ClientAdminConnect.getToken(req.body.code);
    oauth2ClientAdminConnect.setCredentials(tokens);

    const userData = (await google.plus('v1').people.get({ userId: 'me', auth: oauth2ClientAdminConnect })).data;

    let userExist = await models.User.findOne({
      where: {
        googleAuthId: userData.id
      }
    });

    if (userExist) {
      throw BusinessLogicError(errors.FOUND_GOOGLE_ACCOUNT);
    }

    const user = await models.User.update(
      { googleAuthId: userData.id, googleData: JSON.stringify(userData) },
      { where: { id: req.user.id }, returning: true }
    ).then(result => {
      return result[1];
    });

    res.send(user);
  } catch (err) {
    res.status(501).send(err);
  }
};

module.exports = {
  authorize,
  authorizeAdmin,
  handleCallback,
  handleCallbackAdmin,
  authorizeAdminConnect,
  handleCallbackAdminConnect
};
