const express = require('express');
const router = express.Router();
const { login, getMe, seedAdmin } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

router.post('/login', login);
router.get('/me', protect, getMe);
router.get('/seed', seedAdmin);   // GET so you can open it directly in browser
router.post('/seed', seedAdmin);  // POST for Postman / Thunder Client

module.exports = router;
