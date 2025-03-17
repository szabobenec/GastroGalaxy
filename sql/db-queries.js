const mysql = require('mysql');

const pool = mysql.createPool({
    connectionLimit: 10,
    host: '127.0.0.1',
    user: 'root',
    password: '',
    database: 'receptek'
});

//! összes recept lekérése
function selectAll() {
    return new Promise((resolve, reject) => {
        pool.query('SELECT * FROM recept;', (err, result, fields) => {
            if (err) return reject(err);
            resolve(result);
        });
    });
}
//! INSERT INTO recept parancs, paraméterekkel
function insertRecept(tipus, nev, ido, adag, hozzavalok, elkeszites, kepnev, forras) {
    return new Promise((resolve, reject) => {
        pool.query(
            'INSERT INTO recept(tipus, nev, ido, adag, hozzavalok, elkeszites, kepnev, forras) VALUES (?, ?, ?, ?, ?, ?, ?, ?);',
            [tipus, nev, ido, adag, hozzavalok, elkeszites, kepnev, forras],
            (error, result) => {
                if (error) return reject(error);
                resolve(result);
            }
        );
    });
}

module.exports = {
    selectAll,
    insertRecept
};
//?Több function esetén vesszővel felsorolni a meghívható metódusokat. (pl.: selectAll, insertData)
