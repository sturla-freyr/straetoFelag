import dotenv from 'dotenv';
import { readFile } from 'fs/promises';
import pg from 'pg';

const SCHEMA_FILE = './sql/schema.sql';
const DROP_SCHEMA_FILE = './sql/drop.sql';
const INSERT_TEST = './sql/post.sql';

dotenv.config();

const {
  DATABASE_URL: connectionString,
  NODE_ENV: nodeEnv = 'development'
  } =process.env;

if (!connectionString) {
  console.error('vantar DATABASE_URL í .env');
  process.exit(-1);
}

// Notum SSL tengingu við gagnagrunn ef við erum *ekki* í development
// mode, á heroku, ekki á local vél
const ssl = nodeEnv === 'production' ? { rejectUnauthorized: false } : false;

const pool = new pg.Pool({ connectionString, ssl });

pool.on('error', (err) => {
  console.error('Villa í tengingu við gagnagrunn, forrit hættir', err);
  process.exit(-1);
});

export async function query(q, values = []) {
  let client;
  try {
    client = await pool.connect();
  } catch (e) {
    console.error('unable to get client from pool', e);
    return null;
  }

  try {
    const result = await client.query(q, values);
    return result;
  } catch (e) {
    if (nodeEnv !== 'test') {
      console.error('unable to query', e);
    }
    return null;
  } finally {
    client.release();
  }
}

export async function createSchema(schemaFile = SCHEMA_FILE) {
  const data = await readFile(schemaFile);

  return query(data.toString('utf-8'));
}

export async function dropSchema(dropFile = DROP_SCHEMA_FILE) {
  const data = await readFile(dropFile);

  return query(data.toString('utf-8'));
}

export async function insertTest(insertFile = INSERT_TEST) {
  const data = await readFile(insertFile);

  return query(data.toString('utf-8'));
}

export async function end() {
  await pool.end();
}

export async function insertToRegistries(name, kennitala, email, address, phoneNr) {
    const values = [name, kennitala, email, address, phoneNr];
    const q = `
    INSERT INTO
        registries (name, kennitala, email, address, phoneNr) 
    VALUES 
        ($1, $2, $3, $4, $5)
    RETURNING 
        name, kennitala, email, address, phoneNr;
    `;
    try{
      const result = await query(q, values);
      if (result){
          return result.rows;
      }
    } catch(e) {
      console.error('Gat ekki skráð færslu');
    }
    return null;
}

export async function fetchData(){
  const q = `
    SELECT
      *
    FROM
      registries;
  `;
  try{
    const result = await query(q)
    if(result){
      return result.rows;
    }
  } catch(e) {
    console.error('Gat ekki sótt gögn')
  }
  return null;
}

export async function findUserByUsername(username) {
  const q = 'SELECT * FROM users WHERE username = $1';

  try {
    const result = await query(q, [username]);

    if (result.rowCount === 1) {
      return result.rows[0];
    }
  } catch (e) {
    console.error('Notandi fannst ekki');
  }
  return null;
}

export async function findUserById(id) {
  const q = 'SELECT * FROM users WHERE id = $1';

  try {
    const result = await query(q, [id]);

    if (result.rowCount === 1) {
      return result.rows[0];
    }
  } catch (e) {
    console.error('Gat ekki fundið notanda eftir id');
  }

  return null;
}