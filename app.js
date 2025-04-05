//! Modules import
const express = require('express');
const session = require('express-session');
const path = require('path');
const fs = require('fs');
const multer = require('multer');

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
//? Receptkereső:
router.get('/recipes/', (request, response) => {
    response.sendFile(path.join(__dirname + '/public/html/recipes.html'));
});
//? A nap receptje:
router.get('/recipeoftheday/', (request, response) => {
    response.sendFile(path.join(__dirname + '/public/html/recipeoftheday.html'));
});
//? Összes recept:
router.get('/allrecipes/', (request, response) => {
    response.sendFile(path.join(__dirname + '/public/html/allrecipes.html'));
});
//? Spcifikus recept minden adattal:
router.get('/recipefullview/:recept', (request, response) => {
    response.sendFile(path.join(__dirname + '/public/html/recipefullview.html'));
});
//? Recept feltöltése:
router.get('/uploadrecipe', (request, response) => {
    response.sendFile(path.join(__dirname + '/public/html/uploadrecipe.html'));
});
//? Kapcsolat:
router.get('/about/', (request, response) => {
    response.sendFile(path.join(__dirname + '/public/html/about.html'));
});

app.use(express.json());
//! API végpontok
//? Fájlolvasás és -írás
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
        while (j < 31) {
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
let theme = true; //* Az alapértelmezett téma a sötét téma
//? GET - Elküldi az elmentett témát
app.get('/api/gettheme', async (request, response) => {
    try {
        response.status(200).json({ theme: theme });
    } catch (error) {
        response.status(500).json({ message: 'Hiba', response: error });
    }
});
//? POST - Átállítja a témát, ha az oldalon megváltoztattuk
app.post('/api/savetheme', async (request, response) => {
    try {
        const body = request.body;
        theme = body.theme;
        response.status(200).json({ message: 'Sikeres mentés', theme: theme });
    } catch (error) {
        response.status(500).json({ message: 'Hiba', response: error });
    }
});

//! Specifikus recept GET:
app.get('/api/fullview/:recept', async (request, response) => {
    try {
        const recept = request.params.recept + '.%';
        const res = await db.selectSpecificRecipe(recept);

        response.status(200).json({
            message: 'Sikeres lekérdezés',
            response: res[0]
        });
    } catch (error) {
        response.status(500).json({ message: 'Hiba', response: error });
    }
});

//! Receptfeltöltés:
//? Kép felöltése:
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

        response.status(200).json({
            message: data2,
            data: recept,
            response: res
        });
    } catch (error) {
        response.status(500).json({ message: 'Hiba', response: error });
    }
});

//! Setup - Adatbázis frissítése a jelenlegi adatokkal
//? Összes recept beillesztéséhez szükséges függvény:
const DBSetup = async () => {
    try {
        const data = JSON.parse(await readFile('receptek.json')).receptek;

        await db.dropTable();
        await db.createTable();

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

            await db.insertRecept(
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
        }
    } catch (error) {
        console.log(error);
    }
};
//? Ezt kell hozzá kivenni kommentből:
DBSetup();

//! Server
app.use(express.static('public'));
app.use('/', router);
app.listen(port, ip, () => {
    console.log(`Szerver elérhetősége: ${ip}:${port}`);
});
