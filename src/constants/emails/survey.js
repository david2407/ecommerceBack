const { LOCALES } = require('../constants');

const completed = (locale = LOCALES.ES, data = {}) => {
  const content = {
    en: {
      subject: `We've received your evaluation`,
      data: {
        title: 'Thank you for evaluate us!'
      }
    },
    es: {
      subject: 'Hemos recibido tu evaluación',
      data: {
        title: 'Gracias por evaluarnos!'
      }
    }
  };
  return {
    template: 'd-4f32ec2656da4e76b3c9bf6f9c6714fa',
    data: { subject: content[locale].subject, ...data, ...content[locale].data }
  };
};

module.exports = { completed };
