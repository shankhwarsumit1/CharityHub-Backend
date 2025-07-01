const express = require('express');
const router = express.Router();
const authenticate = require('..//middleware/authenticate');
const charityController = require('../controllers/charityController');

router.post('/charity/registration',authenticate,charityController.projectRegistration);
router.get('/charity/getProjectById/:projectId',authenticate,charityController.getProjectById);
router.patch('/charity/updateProject/:projectId',authenticate,charityController.updateProject);


module.exports= router;