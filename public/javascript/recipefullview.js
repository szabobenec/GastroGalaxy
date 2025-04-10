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
            .catch((error) => reject(`Hiba: ${error}`));
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
    try {
        //? Link alapján megfelelő recept rekérése, és adatainak betöltése
        const data = (await getAPI('/api/getallrecept')).response;

        const recept = window.location.href.split('/')[window.location.href.split('/').length - 1];

        const res = (await getAPI(`/api/fullview/${recept}`)).response;
        FillData(res);
        RandomRecipes(data, res);

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
    } else {
        document.body.classList.remove('dark-theme');
        saveTheme = false;
    }

    const postObject = { theme: saveTheme };

    try {
        const data = await postAPI('/api/savetheme', postObject);
        console.log(data);
    } catch (error) {
        console.error(error);
    }
};

//! Megtalált recept adatainak megjelenítése
const FillData = (data) => {
    //? recept neve, elkészítési ideje, elkészített adag, tipusa, tag-jei
    const receptNev = document.getElementById('receptNev');
    receptNev.innerHTML = data.nev;
    const receptIdo = document.getElementById('receptIdo');
    receptIdo.innerHTML = data.ido;
    const receptAdag = document.getElementById('receptAdag');
    receptAdag.innerHTML = data.adag;
    const receptTipus = document.getElementById('receptTipus');
    receptTipus.innerHTML = data.tipus;
    const receptTag = document.getElementById('receptTag');
    if (data.tagek == null) {
        //* ha nincsenek tagek, akkor elrejti a 'tagek' bekezdést
        const receptTagek = document.getElementById('receptTagek');
        receptTagek.style.display = 'none';
    } else {
        const tagek = data.tagek.split(';').join(', ');
        receptTag.innerHTML = tagek;
    }

    //? hozzávalók checkbox listában való megjelenítése
    const receptHozzavalok = document.getElementById('hozzavalok');
    let hozzavalok = JSON.parse(data.hozzavalok);
    for (let item in hozzavalok) {
        const div = document.createElement('div');
        receptHozzavalok.appendChild(div);
        div.setAttribute('class', 'receptList');
        const input = document.createElement('input');
        div.appendChild(input);
        input.type = 'checkbox';
        input.id = item;
        input.setAttribute('class', 'hozzavaloListInputs');
        const label = document.createElement('label');
        div.appendChild(label);
        label.for = item;
        label.innerHTML = `${item}: ${hozzavalok[item]}`;
        label.setAttribute('class', 'receptListLabel hozzavaloListLabels');

        input.addEventListener('change', CrossWords);
    }

    //? recept elkészítésének leírása
    const receptElkeszites = document.getElementById('receptElkeszites');
    for (let item of data.elkeszites.split('\n')) {
        const p = document.createElement('p');
        receptElkeszites.appendChild(p);
        p.innerHTML = item;
    }

    //? recept forrása
    const receptForras = document.getElementById('receptForras');
    receptForras.innerHTML = data.forras;

    //? recept képének megjelenítése, megfelelő .source beállítása
    const receptKep = document.getElementById('receptKep');
    receptKep.setAttribute('src', `../images/recipes/${data.kepnev}`);
};

//! Hozzávalók lista elemeinek kifejlölése esetén való áthúzása
const CrossWords = () => {
    const receptLista = Array.from(document.getElementsByClassName('receptList'));
    for (let item of receptLista) {
        if (item.firstChild.checked) {
            item.lastChild.setAttribute('class', 'receptListLabel hozzavaloListLabels crossed');
        } else {
            item.lastChild.setAttribute('class', 'receptListLabel hozzavaloListLabels');
        }
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
            document.location.href = `${data[item].kepnev.split('.')[0]}`;
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
