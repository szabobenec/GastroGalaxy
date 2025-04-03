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
function insertRecept(tipus, nev, tagek, ido, adag, hozzavalok, elkeszites, kepnev, forras) {
    return new Promise((resolve, reject) => {
        pool.query(
            'INSERT INTO recept(tipus, nev, tagek, ido, adag, hozzavalok, elkeszites, kepnev, forras) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);',
            [tipus, nev, tagek, ido, adag, hozzavalok, elkeszites, kepnev, forras],
            (error, result) => {
                if (error) return reject(error);
                resolve(result);
            }
        );
    });
}
//! SELECT Recipe of the Day
function selectRecipeOfTheDay(id) {
    return new Promise((resolve, reject) => {
        pool.query('SELECT * FROM recept WHERE id = ?;', [id], (error, result) => {
            if (error) return reject(error);
            resolve(result);
        });
    });
}

module.exports = {
    selectAll,
    insertRecept,
    selectRecipeOfTheDay
};
//?Több function esetén vesszővel felsorolni a meghívható metódusokat. (pl.: selectAll, insertData)
