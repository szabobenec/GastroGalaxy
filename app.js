//! Modules import
const express = require('express');
const session = require('express-session');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const bcrypt = require('bcrypt');
const { fork } = require('child_process');

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
//? Admin:
router.get('/login/admin', (reuqest, response) => {
    response.sendFile(path.join(__dirname + '/public/html/admin.html'));
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
        let string = await readFile('rotd.txt');
        const data = JSON.parse(await readFile('receptek.json'));
        const currentMonth = new Date().toISOString().split('T')[0].split('-')[1];

        if (string.split('.')[0] !== currentMonth) {
            let randomIds = [];
            let j = 0;
            while (j < 31) {
                let random = Math.floor(Math.random() * (data.receptek.length - 1 + 1) + 1);
                if (!randomIds.includes(random) && random !== 45) {
                    randomIds.push(random);
                    j++;
                }
            }

            randomIds[0] = 45; //* Shrek az élet, Shrek a szeretet

            string = `${currentMonth}.${randomIds.join(';')}`;

            await writeFile('rotd.txt', string);
        }
    } catch (error) {
        console.log(error);
    }
};
randomOrder();

//! Recipe of the Day API:
app.get('/api/recipe-of-the-day', async (request, response) => {
    try {
        const string = (await readFile('rotd.txt')).split('.')[1];

        const currentDate = new Date().toISOString().split('T')[0];
        const dayCounter = parseInt(currentDate.split('-')[2]);

        const data = string.split(';')[dayCounter - 1];

        const res = await db.selectRecipeOfTheDay(data);

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

//! Light-Dark Theme - Témaválasztó, ami elmenti még oldalváltáskor is a témát:
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

//! Admin felhasználása:
const storageAdmin = multer.diskStorage({
    destination: (request, file, callback) => {
        callback(null, path.join(__dirname + '/public/images/recipes'));
    }
});
const uploadAdmin = multer({ storage: storageAdmin });
//? Admin adatok lekérése, és bejelentkezési engedély küldése:
app.post('/api/login/admin', uploadAdmin.single('file'), async (request, response) => {
    try {
        const formData = request.body;
        const data = (await db.selectAdmin())[0];

        bcrypt.compare(formData.password, data.passw, (error, result) => {
            if (error) {
                response.status(200).json({
                    message: 'Error comparing passwords',
                    response: error
                });
                return;
            }

            if (result) {
                if (formData.username === data.uname) {
                    response.status(200).json({
                        message: 'Passwords match, authentication successful',
                        response: true
                    });
                } else {
                    response.status(200).json({
                        message: `Usernames don't match, authentication failed`,
                        response: false
                    });
                }
            } else {
                response.status(200).json({
                    message: `Passwords don't match, authentication failed`,
                    response: false
                });
            }
        });
    } catch (error) {
        response.status(500).json({ message: 'Hiba', response: error });
    }
});
//? Recept szerkesztő API
app.post('/api/update-recept', uploadAdmin.single('file'), async (request, response) => {
    try {
        const formData = request.body;

        let hozzavalok = formData.hozzavalok;

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

        const res = await db.updateRecept(
            formData.id,
            formData.tipus,
            formData.nev,
            formData.tagek,
            formData.ido,
            formData.adag,
            hozzavalok,
            formData.elkeszites,
            formData.kepnev,
            formData.forras
        );

        //TODO a receptek.json -ben is szerkeszteni kell!!!

        response.status(200).json({
            message: 'Sikeres lekérdezés',
            response: res
        });
    } catch (error) {
        response.status(500).json({ message: 'Hiba', response: error });
    }
});
//? Recept törlő API
app.post('/api/delete-recept', uploadAdmin.single('file'), async (request, response) => {
    try {
        const id = request.body.id;

        const res = await db.deleteRecept(id);

        //TODO a receptek.json -bol is torolni kell!!!

        response.status(200).json({
            message: 'Sikeres lekérdezés',
            response: res
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
        callback(null, file.originalname);
    }
});
const upload = multer({ storage: storage });
app.post('/upload', upload.single('kepSrc'), async (request, response) => {
    try {
        const file = request.file;

        if (!file) {
            return res.status(400).json({ message: 'Nincs feltöltött fájl' });
        }

        response.status(200).json({ message: 'Sikeres feltöltés!' });
    } catch (error) {
        response.status(500).json({ message: 'Hiba', response: error });
    }
});
//? Adatok feltöltése:
app.post('/api/feltoltes', async (request, response) => {
    try {
        const recept = request.body;

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
