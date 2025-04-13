const mysql = require('mysql');

const pool = mysql.createPool({
    connectionLimit: 10,
    host: '127.0.0.1',
    user: 'root',
    password: '',
    database: 'receptek'
});

//! Összes recept lekérése
function selectAll() {
    return new Promise((resolve, reject) => {
        pool.query('SELECT * FROM recept;', (error, result, fields) => {
            if (error) return reject(error);
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
//! Specifikus recept SELECT
function selectSpecificRecipe(nev) {
    return new Promise((resolve, reject) => {
        pool.query('SELECT * FROM recept WHERE kepnev LIKE ?;', [nev], (error, result) => {
            if (error) return reject(error);
            resolve(result);
        });
    });
}

//! Admin
//? Admin adatok lekérése
function selectAdmin() {
    return new Promise((resolve, reject) => {
        pool.query('SELECT uname, passw FROM admin;', (error, result) => {
            if (error) return reject(error);
            resolve(result);
        });
    });
}
//? UPDATE - recept szerkesztése
function updateRecept(id, tipus, nev, tagek, ido, adag, hozzavalok, elkeszites, kepnev, forras) {
    return new Promise((resolve, reject) => {
        pool.query(
            'UPDATE recept SET tipus = ?, nev = ?, tagek = ?, ido = ?, adag = ?, hozzavalok = ?, elkeszites = ?, kepnev = ?, forras = ? WHERE id = ?;',
            [tipus, nev, tagek, ido, adag, hozzavalok, elkeszites, kepnev, forras, id],
            (error, result) => {
                if (error) return reject(error);
                resolve(result);
            }
        );
    });
}
//? DELETE - recept törlése
function deleteRecept(id) {
    return new Promise((resolve, reject) => {
        pool.query('DELETE FROM recept WHERE id = ?;', [id], (error, result) => {
            if (error) return reject(error);
            resolve(result);
        });
    });
}

module.exports = {
    selectAll,
    insertRecept,
    selectRecipeOfTheDay,
    selectSpecificRecipe,
    selectAdmin,
    deleteRecept,
    updateRecept
};
//?Több function esetén vesszővel felsorolni a meghívható metódusokat. (pl.: selectAll, insertData)
