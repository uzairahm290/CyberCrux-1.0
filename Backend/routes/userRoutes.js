const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authenticateToken = require('../middleware/authMiddleware');

router.get('/profile', authenticateToken, userController.getProfile);
router.put('/profile', authenticateToken, userController.updateProfile);
router.get('/profile-picture', authenticateToken, userController.getProfilePicture);
router.post('/profile-picture', authenticateToken, userController.uploadProfilePicture);
router.delete('/account', authenticateToken, userController.deleteAccount);

module.exports = router;
