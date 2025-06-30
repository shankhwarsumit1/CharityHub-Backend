const express = require('express');
const router = express.Router();
const authenticate = require('..//middleware/authenticate');
const profileController = require('../controllers/profileController');

router.patch('/profile/edit',authenticate,profileController.EditProfile);
router.get('/profile',authenticate,profileController.getProfile);
module.exports= router;