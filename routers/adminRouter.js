const express = require('express');
const router = express.Router();
const authenticate = require('..//middleware/authenticate');
const authorizeAdmin = require('../middleware/checkAdmin');
const adminController = require('../controllers/adminController');

router.get('/admin/users',authenticate,authorizeAdmin,adminController.getAllusersByRole);
router.get('/admin/getUser/:id',authenticate,authorizeAdmin,adminController.getUserById);
router.get('/charityprojects',authenticate,adminController.getallProjects);
router.patch('/admin/reviewProject/:projectId',authenticate,authorizeAdmin,adminController.reviewProject);
router.get('/admin/getDonations/:donorId',authenticate,authorizeAdmin,adminController.getDonations)

module.exports= router;