const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const HttpError = require('../models/http-error');
const User = require('../models/user');
const Result = require('../models/result');
const Message = require('../models/message');

const getMessagesChat = async (req, res, next) => {
  let message;
  try {
    message = await Message.find();
  } catch (err) {
    const error = new HttpError(
      'Fetching users failed, please try again later.',
      500
    );
    return next(error);
  }
  res.json(message);
};

const saveMessageChat = async (req, res, next) => {
  const { userId, name, text, date, dateTime, timestamp } = req.body;
  const newMessage = new Message({
    text,
    name,
    userId,
    date,
    dateTime,
    timestamp
  });

  try {
    await newMessage.save();
  } catch (e) {
    const err = new HttpError('Saving message failed, try again', 500);
    return next(err);
  }
  res.json({ message: 'Yey you saved message in DB' });
};

const setUserName = async (req, res, next) => {
  const { userId, name } = req.body;
  let existingUser;

  try {
    existingUser = await User.findByIdAndUpdate(userId, { name });
  } catch (err) {
    const error = new HttpError(
      'Searching user failed, please try again later.',
      501
    );
    return next(error);
  }

  if (!existingUser) {
    const error = new HttpError(
      'User does not exist, you have to log in',
      403
    );
    return next(error);
  }

  // try {
  //   await existingUser.save();
  // } catch (err) {
  //   const error = new HttpError(
  //     'Something went wrong, could not update place.',
  //     502
  //   );
  //   return next(error);
  // }

  res
    .status(201)
    .json(existingUser);

};

const nameUser = async (req, res, next) => {
  const { userId } = req.body;
  let user;
  try {
    user = await User.findById(userId);
  } catch (e) {
    const error = new HttpError(
      'Fetching users failed, please try again later.',
      500
    );
    return next(error);
  }
  res.json(user);
};

const getResults = async (req, res, next) => {
  let results;
  try {
    results = await Result.find();
  } catch (err) {
    const error = new HttpError(
      'Fetching users failed, please try again later.',
      500
    );
    return next(error);
  }
  res.json(results);
};

const saveResult = async (req, res, next) => {
  const { userId, name, time, avatarSrc } = req.body;

  const newResult = new Result({
    name,
    time,
    userId,
    avatarSrc
  });
  try {
    await newResult.save();
  } catch (e) {
    const err = new HttpError('Saving result failed, try again', 500);
    return next(err);
  }
  res.json({ message: 'Yey you saved result' });
};

const login = async (req, res, next) => {
  const { email, password } = req.body;
  let existingUser;

  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    const error = new HttpError(
      'Logging in failed, please try again later.',
      500
    );
    return next(error);
  }

  if (!existingUser) {
    const error = new HttpError(
      'Invalid credentials, could not log you in.',
      403
    );
    return next(error);
  }

  let isValidPassword = false;
  try {
    isValidPassword = await bcrypt.compare(password, existingUser.password);
  } catch (err) {
    const error = new HttpError(
      'Could not log you in, please check your credentials and try again.',
      500
    );
    return next(error);
  }

  if (!isValidPassword) {
    const error = new HttpError(
      'Invalid credentials, could not log you in.',
      403
    );
    return next(error);
  }

  let token;
  try {
    token = jwt.sign(
      { userId: existingUser.id, email: existingUser.email },
      `${process.env.JWT_TOKEN}`,
      { expiresIn: '1h' }
    );
  } catch (err) {
    const error = new HttpError(
      'Logging in failed, please try again later.',
      500
    );
    return next(error);
  }

  res.json({
    userId: existingUser.id,
    email: existingUser.email,
    token: token,
    name: existingUser.name
  });
};

const signup = async (req, res, next) => {

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError('Invalid inputs passed, please check your data.', 422)
    );
  }
  const { name, email, password } = req.body;

  let existingUser;
  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    const error = new HttpError(
      'Signing up failed, please try again later.',
      500
    );
    return next(error);
  }

  if (existingUser) {
    const error = new HttpError(
      'User exists already, please login instead.',
      422
    );
    return next(error);
  }

  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hash(password, 12);
  } catch (err) {
    const error = new HttpError(
      'Could not create user, please try again.',
      500
    );
    return next(error);
  }

  const createdUser = new User({
    name,
    email,
    password: hashedPassword
  });

  try {
    await createdUser.save();
  } catch (err) {
    const error = new HttpError(
      'Signing up failed, please try again later.',
      500
    );
    return next(error);
  }

  let token;
  try {
    token = jwt.sign(
      { userId: createdUser.id, email: createdUser.email },
      `${process.env.JWT_KEY}`,
      { expiresIn: '1h' }
    );
  } catch (err) {
    const error = new HttpError(
      'Signing up failed, please try again later.',
      500
    );
    return next(error);
  }

  res
    .status(201)
    .json({ userId: createdUser.id, email: createdUser.email, token: token });

};

exports.login = login;
exports.signup = signup;
exports.getResults = getResults;
exports.saveResult = saveResult;
exports.nameUser = nameUser;
exports.setUserName = setUserName;
exports.getMessagesChat = getMessagesChat;
exports.saveMessageChat = saveMessageChat;