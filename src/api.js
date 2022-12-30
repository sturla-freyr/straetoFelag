import express from 'express';
import { catchErrors } from './utils/errorsHandler.js';
import { insertToRegistries } from './db.js';

export const router = express.Router();

async function registerRoute(req, res) {
    const { name, kennitala, email, address, phoneNr = ''} = req.body;
    const result = await insertToRegistries(name, kennitala, email, address, phoneNr);
    return res.status(201).json(result);
}

router.get('/login', function (req, res){
    res.render("login", {
        title: 'Félag Farþega'
  })
});

router.post(
    '/register',
    catchErrors(registerRoute),
);