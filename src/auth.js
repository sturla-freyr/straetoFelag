import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

import { findUserByUsername } from './db.js';
import { jwtOptions, requireAdmin, requireAuthentication, tokenOptions } from './utils/passport.js';
import { catchErrors } from './utils/errorsHandler.js';

export const router = express.Router();
dotenv.config();
const {
    BCRYPT_ROUNDS: bcryptRounds = 10,
  } = process.env;

async function loginRoute(req, res){
    const {username, password = ''} = req.body;
    const user = await findUserByUsername(username);
    if (!user) {
        return res.status(401).json({ error: 'No such user' });
    }

    const passIsCorrect = await comparePasswords(password, user.password);
    if (passIsCorrect) {
        const payload = { id: user.id };
        const token = jwt.sign(payload, jwtOptions.secretOrKey, tokenOptions);
        delete user.password;
        return res.render('admin',{
            user,
            token,
            expiresIn: tokenOptions.expiresIn,
            title: 'Félagið'
        });
    }
    return res.status(401).json({error: 'Wrong password'});
}

async function comparePasswords(password, hash) {
    const result = await bcrypt.compare(password, hash);
    return result;
  }
  
router.post(
    '/login',
    catchErrors(loginRoute),
);
