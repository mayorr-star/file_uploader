const { Router } = require('express');
const indexController = require('../controllers/indexController.js');

const router = Router();

router.get('/', indexController.getHomePage);
router.get('/sign_up', indexController.getSignUpPage);
router.get('/sign_in', indexController.getSignInPage);

module.exports = router;