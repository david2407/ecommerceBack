const express = require('express');
const GoogleAuth = require('./GoogleAuth');
const AuthController = require('./AuthController');

const { canSeeAdmin } = require('../../services/AuthService');

const router = express.Router();

router.get('/gmail/authorize', GoogleAuth.authorize);
router.get('/gmail/callback', GoogleAuth.handleCallback);
router.get('/gmail/authorize-admin', GoogleAuth.authorizeAdmin);
router.get('/gmail/callback-admin', GoogleAuth.handleCallbackAdmin);
router.get('/gmail/authorize-admin-connect', GoogleAuth.authorizeAdminConnect);
router.put('/gmail/callback-admin-connect', canSeeAdmin(), GoogleAuth.handleCallbackAdminConnect);
router.post('/token', AuthController.exchangeToken);
router.post('/signup', AuthController.signupUser);
router.post('/login', AuthController.loginUser);
router.post('/forgot-password', AuthController.forgotPassword);
router.put('/reset-password', AuthController.resetPassword);

module.exports = router;
