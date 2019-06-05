const { CronJob } = require('cron');
const moment = require('moment');

const models = require('../models');
const Sequelize = require('sequelize');

const Op = Sequelize.Op;

require('dotenv').config({
  path: require('path').join(__dirname, '..', '..', `${process.env.NODE_ENV}.env`)
});

const EVERY_5_SECONDS = '*/5 * * * * *';
const EVERY_10_SECONDS = '*/10 * * * * *';
const EVERY_10_SECONDS_AFTERNOON = '*/10 * 16-23 * * 1-5';
const EVERY_15_SECONDS = '*/15 * 8-22 * * 1-5';
const EVERY_30_SECONDS = '*/30 * * * * *';
const EVERY_MINUTE = '00 */1 * * * *';
const EVERY_5_MINUTES = '00 */5 * * * *';
const EVERY_10_MINUTES = '00 */10 * * * *';
const EVERY_HOUR = '00 00 * * * 1-5';
const EVERY_FRIDAY = '00 30 11 * * 5';
const EVERY_SATURDAY = '00 30 11 * * 6';
const EVERY_DAY_6_AM = '42 03 6 * * 1-5';

const createCronJob = async (time, func) => {
  if (typeof time === 'undefined' || time === null) {
    throw new Error('No time provided');
  } else if (typeof func === 'undefined' || func === null) {
    throw new Error('No func provided');
  } else {
    let cron = new CronJob(time, func, null, true, 'America/Bogota');
    return cron;
  }
};

const consoleOut = () => {
  createCronJob(EVERY_5_SECONDS, async () => {
    let table = 'Cases';
    let caseId = '05001400302120180028900';
    await models.sequelize.query(`UPDATE "${table}" SET "updatedAt" = now() WHERE id = ${caseId}`);
  })
    .then(() => console.log('Job created consoleOut'))
    .catch(err => console.log('Error while creating the Job consoleOut', err));
};

const sendNotificationEmails = () => {
  createCronJob(EVERY_5_SECONDS, async () => {
    try {
    } catch (e) {
      console.log('ERROR sendNotificationEmails ERRROR', e);
    }
  })
    .then(() => console.log('Job created sendNotificationEmails'))
    .catch(err => console.log('Error while creating the Job sendNotificationEmails', err));
};
module.exports = { sendNotificationEmails };
