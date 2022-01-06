const express = require('express');
const { check } = require('express-validator');

const usersController = require('../controllers/usersControllers');

const router = express.Router();

router.get('/results', usersController.getResults);

router.get('/chat', usersController.getMessagesChat);

router.post('/chat', usersController.saveMessageChat);

router.post('/name', usersController.nameUser);

router.patch('/setname', usersController.setUserName);

router.post('/results', usersController.saveResult);

router.post('/signup', [
  check('name')
    .not()
    .isEmpty(),
  check('email')
    .normalizeEmail()
    .isEmail(),
  check('password').isLength({ min: 6 })
], usersController.signup);

router.post('/login', usersController.login);

module.exports = router;