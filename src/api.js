import express from 'express';
import { catchErrors } from './utils/errorsHandler.js';
import { insertToRegistries, fetchData} from './db.js';
import { xssSanitizeRegistration, 
         sanitizeRegistration,
         validateRegistration } from './utils/validation.js';
import { validationCheck } from './utils/validationHelpers.js';

export const router = express.Router();

async function registerRoute(req, res) {
    const { name, kennitala, email, address, phoneNr = ''} = req.body;
    const result = await insertToRegistries(name, kennitala, email, address, phoneNr);
    return res.status(201).render('registered',{
        title: 'Félag Farþega'
    });
}

/*
async function fetchDataRoute(req, res) {
    const result = await fetchData();
    return res.status(201).json(result);
}
router.get('/fetchData',
    catchErrors(fetchDataRoute),
);
*/

router.get(
    '/login',
    function (req, res){
        res.render("login", {
            title: 'Félag Farþega'
        })
});

router.post(
    '/register',
    xssSanitizeRegistration, 
    sanitizeRegistration,
    validateRegistration,
    validationCheck,
    catchErrors(registerRoute)
);