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
router.get('/recipefullview/:recept', (request, response) => {
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
//! API végpontok
//? fájl olvasás és írás
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
//? Random sorrend generálás:
const randomOrder = async () => {
    try {
        const data = JSON.parse(await readFile('receptek.json'));

        let randomIds = [];
        let j = 0;
        while (j < data.receptek.length) {
            let random = Math.floor(Math.random() * (data.receptek.length - 1 + 1) + 1);
            if (!randomIds.includes(random)) {
                randomIds.push(random);
                j++;
            }
        }
        console.log(randomIds);

        let string = randomIds.join(';');

        await writeFile('rotd.txt', string);
    } catch (error) {
        console.log(error);
    }
};
// randomOrder();

//! Recipe of the Day API:
app.get('/api/recipe-of-the-day', async (request, response) => {
    try {
        const string = await readFile('rotd.txt');
        let randomIds = [];
        for (let item of string.split(';')) {
            randomIds.push(parseInt(item));
        }
        const currentDate = new Date().toISOString().split('T')[0];
        const dayCounter = parseInt(currentDate.split('-')[currentDate.split('-').length - 1]);

        const res = await db.selectRecipeOfTheDay(randomIds[dayCounter - 1]);

        response.status(200).json({
            message: 'Sikeres lekérdezés',
            response: res
        });
    } catch (error) {
        response.status(500).json({ message: 'Hiba', response: error });
    }
});

//! Nap recepje apik; Dátum visszaigazolása
app.post('/check-date', (req, res) => {
    const datumPath = path.join(__dirname, '/public/assets/datum.txt');
    const idPath = path.join(__dirname, '/public/assets/azonosito.txt');

    let az = null;
    fs.readFile(datumPath, 'utf8', (err, fileDate) => {
        if (err) {
            console.error('Error reading file:', err); // Log the error
        }

        // Get the current date in YYYY-MM-DD format
        const currentDate = new Date().toISOString().split('T')[0]; // Format: YYYY-MM-DD

        // Check if the date in the file matches the current date
        if (fileDate.trim() === currentDate) {
            fs.readFile(idPath, 'utf8', (err, fileId) => {
                if (err) {
                    console.error('Error reading file:', err); // Log the error
                    return res.status(500).json({ error: 'Error reading file' });
                }
                return res.json({ message: currentDate + ' id: ' + fileId });
            });
        } else {
            fs.writeFile(datumPath, currentDate, (err) => {
                if (err) console.log(err);
            });
            let newID = '' + (Math.floor(Math.random() * 10) + 1);
            fs.writeFile(idPath, newID, (err) => {
                if (err) console.log(err);
            });
            res.json({ message: 'Updated date to today: ' + currentDate + ' id: ' + newID });
        }
    });
});

//! Összes recept API:
app.get('/api/getallrecept', async (request, response) => {
    try {
        const res = await db.selectAll();
        response.status(200).json({
            message: 'Sikeres lekérdezés',
            response: res
        });
    } catch (error) {
        response.status(500).json({ message: error });
    }
});

//! Light-Dark Theme - Témaválasztó, ami elmenti még oldalváltáskor is a témát
let theme = true;
//? GET - Elküldi az előzőleg beállított témát
app.get('/api/gettheme', async (request, response) => {
    try {
        response.status(200).json({ theme: theme });
    } catch (error) {
        response.status(500).json({ message: error });
    }
});
//? POST - Átállítja a témát, ha az oldalon megváltoztattuk
app.post('/api/savetheme', async (request, response) => {
    try {
        const body = request.body;
        theme = body.theme;
        response.status(200).json({ message: theme });
    } catch (error) {
        response.status(500).json({ message: error });
    }
});

//! Random recept API:
app.get('/api/getrandomrecipe', async (request, response) => {
    try {
        // const data = JSON.parse(await readFile('receptek.json'));
        const data = await db.selectAll();
        const random = Math.floor(Math.random() * (data.receptek.length - 1 - 0 + 1) + 0);
        response.status(200).json(data.response[random]);
    } catch (error) {
        console.log(error.message);
    }
});

//! Specifikus recept POST - GET:
let recept = '';
app.post('/api/postrecept', (request, response) => {
    recept = request.body.recept;
    console.log(recept);
    response.status(200).json({ message: 'Sikeres mentés' });
});
app.get('/api/getrecept', (request, response) => {
    response.status(200).json({ recept: recept });
});

// app.get('/api/fullview/:recept', (request, response) => {
//     const recept = request.params.recept;
//     const link = `/recipefullview/${recept}`;
// });

//! Receptfeltöltés:
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
//? Adatok feltöltése:
app.post('/api/feltoltes', async (request, response) => {
    const recept = request.body;
    console.log(recept);
    try {
        let hozzavalok = JSON.stringify(recept.hozzavalok);

        hozzavalok =
            '{' +
            hozzavalok
                .split('[')
                .join('')
                .split(']')
                .join('')
                .split('{')
                .join('')
                .split('}')
                .join('') +
            '}';

        const res = await db.insertRecept(
            recept.tipus,
            recept.nev,
            recept.tagek,
            recept.ido,
            recept.adag,
            hozzavalok,
            recept.elkeszites,
            recept.kepnev,
            recept.forras
        );

        const data = JSON.parse(await readFile('receptek.json'));
        data.receptek.push(recept);
        const data2 = await writeFile('receptek.json', JSON.stringify(data));

        response.status(200).json({ message: data2, data: recept, response: res });
    } catch (error) {
        response.status(500).json({ message: error });
    }
});

//! Setup
//? Összes recept beillesztéséhez szükséges függvény:
const DBSetup = async () => {
    try {
        const data = JSON.parse(await readFile('receptek.json')).receptek;

        for (let item of data) {
            let hozzavalok = JSON.stringify(item.hozzavalok);
            hozzavalok =
                '{' +
                hozzavalok
                    .split('[')
                    .join('')
                    .split(']')
                    .join('')
                    .split('{')
                    .join('')
                    .split('}')
                    .join('') +
                '}';

            const res = await db.insertRecept(
                item.tipus,
                item.nev,
                item.tagek,
                item.ido,
                item.adag,
                hozzavalok,
                item.elkeszites,
                item.kepnev,
                item.forras
            );

            console.log(res);
        }
    } catch (error) {
        console.log(error);
    }
};
//? Ezt kell hozzá kivenni kommentből:
// DBSetup();

//! Server
app.use(express.static('public'));
app.use('/', router);
app.listen(port, ip, () => {
    console.log(`Szerver elérhetősége: ${ip}:${port}`);
});
