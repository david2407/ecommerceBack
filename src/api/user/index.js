const express = require('express');
const { isAuthenticated } = require('../../services/AuthService');
const UserController = require('./UserController');
const router = express.Router();

router.get('/me', UserController.me);
router.put('/me', UserController.update);

module.exports = router;
