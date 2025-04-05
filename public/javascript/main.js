//! GET metódus
const getAPI = (url) => {
    return new Promise((resolve, reject) => {
        fetch(url)
            .then((response) => {
                if (!response.ok) {
                    reject(`Hiba: ${response.statusText} (${response.status})`);
                }
                return response.json();
            })
            .then((data) => resolve(data))
            .catch((error) => reject(`Hiba történt: ${error.message}`));
    });
};

//! POST metódus
const postAPI = (url, postObject) => {
    return new Promise((resolve, reject) => {
        fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(postObject)
        })
            .then((response) => {
                if (!response.ok) {
                    reject(`Hiba: ${response.statusText} (${response.status})`);
                }
                return response.json();
            })
            .then((data) => resolve(data))
            .catch((error) => reject(`Hiba: ${error}`));
    });
};

document.addEventListener('DOMContentLoaded', async () => {
    console.log('Welcome to Gastro Galaxy!');
    try {
        const data = (await getAPI('/api/getallrecept')).response;
        let random = Math.floor(Math.random() * (data.length - 1 - 0 + 1) + 0);
        let recept = data[random];
        RandomRecipes(data, recept);

        //? Témaválasztás a NAV-ban lévő SVG segítségével
        const themeChanger = document.getElementById('themeChanger');
        const theme = (await getAPI('/api/gettheme')).theme;
        if (theme) {
            document.body.classList.add('dark-theme');
            themeChanger.setAttribute('checked', true);
        } else {
            document.body.classList.remove('dark-theme');
            themeChanger.removeAttribute('checked');
        }

        themeChanger.addEventListener('change', () => {
            changeTheme(themeChanger);
        });
    } catch (error) {
        console.error(error);
    }
});

//! Témaváltásért felelő függvény
const changeTheme = async (theme) => {
    let saveTheme;
    if (theme.checked) {
        document.body.classList.add('dark-theme');
        saveTheme = true;
        document.getElementById('introImg3').src = '../images/logoTitle.png';
    } else {
        document.body.classList.remove('dark-theme');
        saveTheme = false;
        document.getElementById('introImg3').src = '../images/invert.png';
    }

    const postObject = { theme: saveTheme };

    try {
        await postAPI('/api/savetheme', postObject);
    } catch (error) {
        console.error(error);
    }
};

//! Pár darab random recept megjelenítése a lap alján
const RandomRecipes = (data, recept) => {
    const randomReceptek = document.getElementById('randomReceptek');
    let indexek = [];
    let index = 0;

    //? random, különböző indexek létrehozása
    for (let i = 0; i < data.length; i++) {
        if (data[i].nev === recept.nev) {
            index = i;
        }
    }

    while (indexek.length !== 4) {
        let j = Math.floor(Math.random() * (data.length - 1 - 0 + 1) + 0);
        if (!indexek.includes(j) && j !== index) {
            indexek.push(j);
        }
    }

    //? létrehozott indexekhez tartozó receptek megjelenítése
    for (let item of indexek) {
        const div = document.createElement('div');
        randomReceptek.appendChild(div);
        div.setAttribute('class', 'randomRecipes grow');
        //? Rákattintott recept oldalára való továbbküldés
        div.addEventListener('click', () => {
            document.location.href = `recipefullview/${data[item].kepnev.split('.')[0]}`;
        });

        const titleDiv = document.createElement('div');
        div.appendChild(titleDiv);
        titleDiv.setAttribute('class', 'titleDiv');

        const h3 = document.createElement('h3');
        titleDiv.appendChild(h3);
        h3.innerHTML = data[item].nev;

        const img = document.createElement('img');
        div.appendChild(img);
        img.setAttribute('src', `../images/recipes/${data[item].kepnev}`);
        img.setAttribute('class', 'littleImg');
    }
};
