// Invalid arguments errors
const INVALID_USER = 'backend.error.arguments.user';
const INVALID_USER_ID = 'backend.error.arguments.userId';
const INVALID_EMAIL = 'backend.error.arguments.email';
const INVALID_PASSWORD = 'backend.error.arguments.password';
const INVALID_PASSWORD_LOGIN_GOOGLE = 'backend.error.arguments.loginGoogle';
const INVALID_NEW_PASSWORD = 'backend.error.arguments.newPassword';
const INVALID_DATA = 'backend.error.arguments.data';
const INVALID_HASH = 'backend.error.arguments.hash';
const INVALID_TOKEN = 'backend.error.arguments.token';
const INVALID_SCORE = 'backend.error.arguments.score';

// Business logic errors
const FOUND_EMAIL = 'backend.error.business.email';
const NOT_FOUND_EMAIL = 'backend.error.business.noEmail';
const FOUND_USER = 'backend.error.business.user';
const NOT_FOUND_USER = 'backend.error.business.noUser';

module.exports = {
  INVALID_USER,
  INVALID_EMAIL,
  INVALID_USER_ID,
  INVALID_DATA,
  INVALID_PASSWORD,
  INVALID_PASSWORD_LOGIN_GOOGLE,
  INVALID_NEW_PASSWORD,
  INVALID_HASH,
  INVALID_TOKEN,
  INVALID_SCORE,
  FOUND_EMAIL,
  FOUND_USER,
  NOT_FOUND_EMAIL,
  NOT_FOUND_USER

};
