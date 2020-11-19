const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');
const userCtrl = require('../controllers/user.controllers');

router.post('/signup', userCtrl.signup);
router.post('/login', userCtrl.login);
router.get('/profile/:id', auth, userCtrl.readUser);
router.put('/profile/:id', auth, multer, userCtrl.updateUser);
router.delete('/profile/:id', auth, userCtrl.deleteUser);

module.exports = router;