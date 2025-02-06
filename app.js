//! Modules import
const express = require('express');
const session = require('express-session');
const path = require('path');
const fs = require('fs');

const app = express();
const router = express.Router();
//! SQL Queries import
const db = require(path.join(__dirname + '/sql/db-queries'));

const ip = '127.0.0.1';
const port = 3000;

//! Session
app.use(
    session({
        secret: 'titkos_kulcs',
        resave: false,
        saveUninitialized: true
    })
);

//! Routing
//? Főoldal:
router.get('/', (request, response) => {
    response.sendFile(path.join(__dirname + '/public/html/main.html'));
});
//? Receptek:
router.get('/recipes/', (request, response) => {
    response.sendFile(path.join(__dirname + '/public/html/recipes.html'));
});
//? A nap receptje:
router.get('/recipeoftheday/', (request, response) => {
    response.sendFile(path.join(__dirname + '/public/html/recipeoftheday.html'));
});
//? Kapcsolat:
router.get('/connection/', (request, response) => {
    response.sendFile(path.join(__dirname + '/public/html/connection.html'));
});

app.use(express.json());
//! API
const readFile = (file) => {
    return new Promise((resolve, reject) => {
        fs.readFile(file, 'utf-8', (error, data) => {
            if (error) {
                reject(error);
            } else {
                resolve(data);
            }
        });
    });
};
//? Összes recept API:
app.get('/api/getallrecept', async (request, response) => {
    try {
        const data = JSON.parse(await readFile('receptek.json'));
        response.json(data);
    } catch (error) {
        console.log(error.message);
    }
});
//? Random recept API:
app.get('/api/getrandomrecipe', async (request, response) => {
    try {
        const data = JSON.parse(await readFile('receptek.json'));
        const random = Math.floor(Math.random() * (data.receptek.length - 1 - 0 + 1) + 0);
        response.json(data.receptek[random]);
    } catch (error) {
        console.log(error.message);
    }
});

//! Server
app.use(express.static('public'));
app.use('/', router);
app.listen(port, ip, () => {
    console.log(`Szerver elérhetősége: ${ip}:${port}`);
});
