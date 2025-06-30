const express = require('express');
const router = express.Router();
const authenticate = require('..//middleware/authenticate');
const paymentController = require('../controllers/paymentController');

router.post('/createOrder',authenticate,paymentController.createOrder);
router.post('/webhook',paymentController.webhook)

module.exports= router;