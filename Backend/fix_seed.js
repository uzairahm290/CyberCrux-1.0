const fs = require('fs');

let sql = fs.readFileSync('seed.sql', 'utf8');

// Fix column name "FullName"
sql = sql.replace(/FullName/g, '"FullName"');

// Fix boolean values at the end of tuples
sql = sql.replace(/, 1\)/g, ', true)');
sql = sql.replace(/, 0\)/g, ', false)');

// Fix escaped single quotes in strings for postgres
sql = sql.replace(/\\'/g, "''");

fs.writeFileSync('seed_fixed.sql', sql);
console.log('Fixed seed.sql');
