const express = require('express');
const router = express.Router();
const bookController = require('../controllers/bookController');
const authenticateToken = require('../middleware/authMiddleware'); // If needed in future

// Public routes for reading books
router.get('/', bookController.getBooks);
router.get('/categories', bookController.getCategories);
router.get('/:id', bookController.getBookById);

// Admin or authenticated routes (assuming they should be protected, but currently they aren't explicitly protected in the old code)
router.post('/', bookController.createBook);
router.put('/:id', bookController.updateBook);
router.delete('/:id', bookController.deleteBook);

module.exports = router;
