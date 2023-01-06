import { body } from 'express-validator';
import xss from 'xss';
import bcrypt from 'bcrypt';
import { findUserByUsername } from '../db.js';
import { LoginError } from './errorsHandler.js';
import { logger } from './logger.js';

export const xssSanitizeRegistration = [
    body('name').customSanitizer((v) => xss (v)),
    body('kennitala').customSanitizer((v) => xss (v)),    
    body('email').customSanitizer((v) => xss (v)),
    body('address').customSanitizer((v) => xss (v)),
    body('phoneNr').customSanitizer((v) => xss (v))
];

export const sanitizeRegistration = [
    body('name').trim().escape(),
    body('kennitala').trim().escape(),
    body('email').trim().escape(),
    body('address').trim().escape(),
    body('phoneNr').trim().escape(),
];

export const validateRegistration = [
    body('name')
        .exists()
        .withMessage('name is required')
        .isString()
        .withMessage('name must be a string')
        .isLength({ max: 256 })
        .withMessage('Name can be 256 characters'),
    body('kennitala')
        .isString()
        .withMessage('Kennitala must be a string')
        .isLength({min: 10})
        .withMessage('Kennitala is 10 letters')
        .isLength({max: 10})
        .withMessage('Kennitala is 10 letters'),
    body('email')
        .isEmail()
        .withMessage('Email must be an email'),
    body('address')
        .isLength({max: 128})
        .withMessage('Address can be 128 characters'),
    body('phoneNr')
        .isLength({max: 32})
        .withMessage('Phonenumber can be 32 characters')
];

export const xssSanitizeUsername = [
    body('username').customSanitizer((v) => xss(v))
];

export const sanitizeUsername = [
    body('username').trim().escape(),
];

export const validateUsernameAndPass = [
    body('username')
      .exists()
      .withMessage('username is required')
      .isLength({ min: 4})
      .withMessage('Notendarnafn verður að vera a.m.k 4 stafir')
      .isLength({ max: 32})
      .withMessage('Notendarnafn má ekki vera lengri en 32 stafir'),
    body('password')
      .exists()
      .withMessage('password is required')
      .isLength({ min: 3})
      .withMessage('Lykilorð verður að vera a.m.k 3 stafir')
      .isLength({ max: 32})
      .withMessage('Lykilorð má ekki vera lengra en 32 stafir')
  ];


async function comparePasswords(password, hash) {
    const result = await bcrypt.compare(password, hash);
    return result;
}

export const usernameAndPasswordValidator = body('username')
  .custom(async (username, { req: { body: reqBody } = {} }) => {
    // Can't bail after username and password validators, so some duplication
    // of validation here
    // TODO use schema validation instead?
    const { password } = reqBody;

    if (!username || !password) {
      return Promise.reject(new Error('skip'));
    }

    let valid = false;
    try {
      const user = await findUserByUsername(username);
      valid = await comparePasswords(password, user.password);
    } catch (e) {
      // Here we would track login attempts for monitoring purposes
      logger.info(`invalid login attempt for ${username}`);
    }

    if (!valid) {
      return Promise.reject(new LoginError('username or password incorrect'));
    }
    return Promise.resolve();
  });