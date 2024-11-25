const express = require('express');
const { login, register } = require('../controllers/authController');
const router = express.Router();

router.post('/signup', register);
router.post('/login', login);

module.exports = router;
