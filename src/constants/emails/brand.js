const { LOCALES } = require('../constants');

const confirm = (locale = LOCALES.ES, data = {}) => {
  const content = {
    en: {
      subject: 'New brand activated',
      data: {
        content: `The ${data.brandName} brand has accepted to join us.`
      }
    }
  };
  return {
    template: 'd-1cf2130da0504e28ad4a766e9c03f52d',
    data: { subject: content[locale].subject, ...data, ...content[locale].data }
  };
};

const create = (locale = LOCALES.ES, data = {}) => {
  const content = {
    en: {
      subject: 'Your brand has been created',
      data: {
        title: 'Your brand has been created',
        content: `<p>Hi <strong>${data.name}, welcome to Franager!</strong>,</p>
        <p> We have created your brand <strong>${
          data.brandName
        }</strong> now you only need to set your password to start optimizing your business.</p>`,
        actionLabel: 'Set password'
      }
    },
    es: {
      subject: 'Tu marca ha sido creada',
      data: {
        title: 'Tu marca ha sido creada',
        content: `<p>Hola <strong>${data.name}, bienvenido a Franager!</strong>,</p>
        <p> Hemos creado tu marca <strong>${
          data.brandName
        }</strong>, ahora solo falta que crees tu contraseña para iniciar a optimizar tu negocio.</p>`,
        actionLabel: 'Crear contraseña'
      }
    }
  };
  return {
    template: 'd-a62abc6b8c5044eebc4e49fd4c4e419c',
    data: { subject: content[locale].subject, ...data, ...content[locale].data }
  };
};

const newAuditor = (locale = LOCALES.ES, data = {}) => {
  const content = {
    en: {
      subject: 'New auditor account created',
      data: {
        title: 'Account created!',
        content: `<p>Hi <strong>${data.name}</strong>,</p>
        <p> The <strong>${
          data.brandName
        }</strong> brand has created a Franager account for you to audit their franchises.</p>
        <p> Now you can set your password and start auditing them.</p>`,
        actionLabel: 'Set password'
      }
    },
    es: {
      subject: 'Nuevo cuenta de auditor creada',
      data: {
        title: 'Cuenta creada!',
        content: `<p>Hola <strong>${data.name}</strong>,</p>
        <p> La marca <strong>${
          data.brandName
        }</strong> te ha creado una cuenta en Franager para que audites sus franquicias.</p>
        <p>Ahora puedes asignar tu contraseña y empezar a auditarlos.</p>`,
        actionLabel: 'Crear contraseña'
      }
    }
  };
  return {
    template: '',
    data: { subject: content[locale].subject, ...data, ...content[locale].data }
  };
};

module.exports = { confirm, create, newAuditor };
