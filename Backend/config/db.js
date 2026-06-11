const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');
const { PrismaClient } = require('@prisma/client');

const DB_CONFIG = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'apple',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_DATABASE || 'cybercrux',
  port: process.env.DB_PORT || 5432
};

const pool = new Pool(DB_CONFIG);

const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const executeQuery = async (query, params = []) => {
  const client = await pool.connect();
  try {
    // 1. Convert MySQL '?' to Postgres '$1, $2'
    let pgQuery = '';
    let paramIndex = 1;
    let inSingleQuote = false;
    let inDoubleQuote = false;
    
    for (let i = 0; i < query.length; i++) {
        if (query[i] === "'" && !inDoubleQuote) {
            inSingleQuote = !inSingleQuote;
            pgQuery += query[i];
        } else if (query[i] === '"' && !inSingleQuote) {
            inDoubleQuote = !inDoubleQuote;
            pgQuery += query[i];
        } else if (query[i] === '?' && !inSingleQuote && !inDoubleQuote) {
            pgQuery += '$' + paramIndex;
            paramIndex++;
        } else {
            pgQuery += query[i];
        }
    }

    // 2. Add RETURNING id for INSERT statements
    const isInsert = /^\s*INSERT\s+INTO/i.test(pgQuery);
    if (isInsert && !/RETURNING/i.test(pgQuery)) {
        pgQuery += ' RETURNING id';
    }

    // 3. Convert MySQL specific date/interval functions
    pgQuery = pgQuery.replace(/NOW\(\)/gi, 'CURRENT_TIMESTAMP');

    // Execute query
    const result = await client.query(pgQuery, params);
    
    // 4. Format the output to match MySQL's output
    if (/^\s*(SELECT|SHOW|DESCRIBE)/i.test(pgQuery)) {
        // SELECTs return an array of rows
        return result.rows;
    } else {
        // INSERT/UPDATE/DELETE return an object with affectedRows and insertId
        const out = {
            affectedRows: result.rowCount,
            insertId: null
        };
        
        if (isInsert && result.rows.length > 0 && result.rows[0].id) {
            out.insertId = result.rows[0].id;
        }
        
        return out;
    }
  } finally {
    client.release();
  }
};

module.exports = { pool, executeQuery, DB_CONFIG, prisma };
