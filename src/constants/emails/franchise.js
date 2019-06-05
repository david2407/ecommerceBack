const { LOCALES } = require('../constants');

const create = (locale = LOCALES.ES, data = {}) => {
  const content = {
    en: {
      subject: `Your franchise  has been created`,
      data: {
        title: 'Your franchise  has been created!',
        content: `<p>Hi <strong>${data.name}</strong>, welcome to the franchise's manager for ${data.brandName} </p>
        <p>We've  created your franchise ${
          data.franchiseName
        }, now you only need to set your password to start optimizing your business.</p>`,
        actionLabel: 'Set Password'
      }
    },
    es: {
      subject: 'Tu franquicia ha sido creada',
      data: {
        title: 'Tu franquicia ha sido creada!',
        content: `<p> Hola <strong>${data.name}</strong>, bienvenido al sistema de gestion de franquicias de ${
          data.brandName
        }</p>
        <p> Hemos creado tu franquicia ${
          data.franchiseName
        }, ahora solo falta que crees tu contraseña para iniciar a optimizar tu negocio. </p>`,
        actionLabel: 'Crear Contraseña'
      }
    }
  };
  return {
    template: 'd-ba7df8ed74914fffb3899b3be813be2c',
    data: { ...content[locale].data, ...data, subject: content[locale].subject }
  };
};

const confirm = (locale = LOCALES.ES, data = {}) => {
  const content = {
    en: {
      subject: 'New franchise activated',
      data: {
        title: 'Franchise activated!',
        content: `<p>Hi <strong>${data.name}</strong>,</p>
        <p>The <strong>${data.franchiseName}</strong> franchise created for you has accepted to join Franager</p>`
      }
    },
    es: {
      subject: 'Nueva franquicia activada',
      data: {
        title: 'Franquicia activada!',
        content: `<p>Hola <strong>${data.name}</strong>,</p>
        <p>La franquicia <strong>${data.franchiseName}</strong> creada por ti, ha aceptado unirse a Franager</p>`
      }
    }
  };
  return {
    template: 'd-f4897ead04424f2ca2991f42c54210fa',
    data: { subject: content[locale].subject, ...data, ...content[locale].data }
  };
};

module.exports = { create, confirm };
