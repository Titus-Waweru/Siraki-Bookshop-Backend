const pgp = require('pg-promise')();
require('dotenv').config();

const db = pgp(process.env.POSTGRES_URI);

module.exports = db;
