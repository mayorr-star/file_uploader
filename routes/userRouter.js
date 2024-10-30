const { Router } = require('express');
const userController = require('../controllers/userController.js');

const router = Router();

router.post('/sign_up', userController.postUser);

module.exports = router;