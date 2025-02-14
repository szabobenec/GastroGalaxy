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
//? Recept minden adattal együtt:
router.get('/recipefullview/', (request, response) => {
    response.sendFile(path.join(__dirname + '/public/html/recipefullview.html'));
});
//? Összes recept:
router.get('/allrecipes/', (request, response) => {
    response.sendFile(path.join(__dirname + '/public/html/allrecipes.html'));
});
//? Recept feltöltése:
router.get('/uploadrecipe', (request, response) => {
    response.sendFile(path.join(__dirname + '/public/html/uploadrecipe.html'));
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
const writeFile = (file, text) => {
    return new Promise((resolve, reject) => {
        fs.writeFile(file, text, 'utf-8', (error) => {
            if (error) {
                reject(error);
            }
            resolve('Sikeres feltöltés');
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
//? Specifikus recept POST - GET:
let recept = '';
app.post('/api/recept', (request, response) => {
    recept = request.body.recept;
    console.log(recept);
    response.status(200).json({ message: 'Sikeres mentés' });
});
app.get('/api/recept', (request, response) => {
    response.status(200).json({ recept: recept });
});

//! Képfeltöltés:
//? Kép felöltése:
const multer = require('multer');
const storage = multer.diskStorage({
    destination: (request, file, callback) => {
        callback(null, path.join(__dirname + '/public/images/recipes'));
    },
    filename: (request, file, callback) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        callback(null, file.originalname);
    }
});
const upload = multer({ storage: storage });
app.post('/upload', upload.single('uploaded_file'), (request, response) => {
    response.status(200).json({ message: 'Sikeres feltöltés!' });
});
//? Recept feltöltése:
app.post('/api/feltoltes', async (request, response) => {
    try {
        const recept = request.body;
        const data = JSON.parse(await readFile('receptek.json'));
        data.receptek.push(recept);
        const data2 = await writeFile('receptek.json', JSON.stringify(data));

        response.status(200).json({ message: data2, data: recept });
    } catch (error) {
        response.status(500).json({ message: error });
    }
});

//! Server
app.use(express.static('public'));
app.use('/', router);
app.listen(port, ip, () => {
    console.log(`Szerver elérhetősége: ${ip}:${port}`);
});
