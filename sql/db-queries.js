const mysql = require('mysql');

const pool = mysql.createPool({
    connectionLimit: 10,
    host: '127.0.0.1',
    user: 'root',
    password: '',
    database: 'exampledb'
});

function selectAll() {
    return new Promise((resolve, reject) => {
        pool.query('SELECT * FROM exampletable;', (err, result, fields) => {
            if (err) return reject(err);
            resolve(result);
        });
    });
}

module.exports = {
    selectAll
};
//?Több function esetén vesszővel felsorolni a meghívható metódusokat. (pl.: selectAll, insertData)
