const sendGrid = require('@sendgrid/mail');
const winston = require('winston');
const path = require('path');

const models = require('../models');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({
      filename: path.join(__dirname, '..', '..', 'logs', 'log-error.log'),
      level: 'error'
    }),
    new winston.transports.File({ filename: path.join(__dirname, '..', '..', 'logs', 'log-warn.log'), level: 'warn' }),
    new winston.transports.File({ filename: path.join(__dirname, '..', '..', 'logs', 'log-combined.log') })
  ]
});
const sendEmail = async (to, emailLayout) => {
  if (process.env.SEND_EMAILS === true) {
    console.log(`EMAILS DISABLED: Tried to send email to ${to} for template ${emailLayout.template}`);
    return;
  }
  sendGrid.setApiKey(process.env.SENDGRID);

  const msg = {
    to,
    from: {
      email: 'info@franager.com',
      name: 'Franager'
    },
    templateId: emailLayout.template,
    substitutionWrappers: ['{{', '}}'],
    dynamicTemplateData: emailLayout.data
  };
  sendGrid.send(msg);
};

if (process.env.NODE_ENV !== 'production') {
  logger.add(
    new winston.transports.Console({
      format: winston.format.simple()
    })
  );
}

const logError = async (error, userId = null) => {
  console.log('LOG_ERROR:', error, 'USER_ID:', userId);
  await models.Error.create({
    error,
    userId
  });
};

const getRoleData = (user, merge = false) => {
  let roleData = {};
  if (user.isAdmin) {
    roleData.role = 'admin';
  } else if (user.Brands.length > 0) {
    roleData.role = `brand_${user.Brands[0].UserBrands.role}`;
    roleData.isBrand = true;
    roleData.brandId = user.Brands[0].id;
  } else if (user.Franchises.length > 0) {
    roleData.role = `franchise_${user.Franchises[0].UserFranchises.role}`;
    roleData.isFranchise = true;
    roleData.franchiseId = user.Franchises[0].id;
  } else {
    roleData.role = 'guest';
  }
  if (merge) {
    return (user.dataValues = { ...user.dataValues, ...roleData });
  }
  return roleData;
};

const getAdminUrl = (subDomain = 'admin') => {
  return `${process.env.URL_PROTOCOL}${subDomain}.${process.env.ADMIN_URL.replace('admin.', '')}`;
};

module.exports = { sendEmail, logger, logError, getRoleData, getAdminUrl };
