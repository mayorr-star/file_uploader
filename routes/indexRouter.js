const { Router } = require('express');
const indexController = require('../controllers/indexController.js');

const router = Router();

router.get('/', indexController.getHomePage);
router.get('/sign_up', indexController.getSignUpPage);

module.exports = router;