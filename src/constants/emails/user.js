const { LOCALES } = require('../constants');

const resetPassword = (locale = LOCALES.ES, data = {}) => {
  const content = {
    en: {
      subject: 'Reset your password',
      data: {
        title: 'Reset Password',
        content: `<p>Hi <strong>${data.name}</strong>,</p>
        <p>You have forgotten your Franager password, here you can set a new one</p>`,
        actionLabel: 'Reset password!'
      }
    },
    es: {
      subject: 'Recupera tu contraseña',
      data: {
        title: 'Recuperar Contraseña',
        content: `<p>Hola <strong>${data.name}</strong>,</p>
        <p>Parece que has olvidado tu contraseña de Franager, aquí puedes crear una nueva.</p>`,
        actionLabel: 'Recuperar contraseña'
      }
    }
  };

  return {
    template: 'd-442edec1fcc14418b4eaec6f1e1b6ab7',
    data: { subject: content[locale].subject, ...data, ...content[locale].data }
  };
};

module.exports = { resetPassword };
