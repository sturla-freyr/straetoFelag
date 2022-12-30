import * as dotenv from 'dotenv' // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
import express from 'express';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

import { router } from './api.js';

dotenv.config();
const { PORT: port = 3000,
        DATABASE_URL: connectionString, } = process.env;

if (!connectionString) {
  console.error('Vantar env gildi');
  process.exit(1);
}

dotenv.config();
const app = express();


// Sér um að req.body innihaldi gögn úr formi
app.use(express.urlencoded({ extended: true }));
const path = dirname(fileURLToPath(import.meta.url));
app.use(express.static(join(path, '../public')));
app.set('views', join(path, '../views'));
app.set('view engine', 'ejs');
app.use(express.json());

app.use(router);
app.get('/', function (req, res) {
  res.send(process.env.HELLO_MESSAGE)
})

app.listen(port, () => {
  console.info(`Server running at http://localhost:${port}/`);
});