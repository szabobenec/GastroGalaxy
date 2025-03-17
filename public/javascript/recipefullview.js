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
    //! backend-en lementett recept név megkeresése az összes receptben
    try {
        const data = (await getAPI('/api/getallrecept')).response;
        const receptNev = await getAPI('/api/getrecept');
        let random = Math.floor(Math.random() * (data.length - 1 - 0 + 1) + 0);
        let recept = data[random];
        for (let item of data) {
            if (item.nev == receptNev.recept) {
                recept = item;
            }
        }
        FillData(recept);
        RandomRecipes(data, recept);
    } catch (error) {
        console.error(error);
    }
});

const FillData = (data) => {
    //! megtalált recept adatainak megjelenítése
    //? recept neve, elkészítési ideje, alkészített adag, tipusa, tag-jei
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

const CrossWords = () => {
    //! hozzávalók lista elemeinek kifejlölése esetén való áthúzása
    const receptLista = Array.from(document.getElementsByClassName('receptList'));
    for (let item of receptLista) {
        if (item.firstChild.checked) {
            item.lastChild.setAttribute('class', 'receptListLabel hozzavaloListLabels crossed');
        } else {
            item.lastChild.setAttribute('class', 'receptListLabel hozzavaloListLabels');
        }
    }
};

const RandomRecipes = (data, recept) => {
    //! pár darab random recept megjelenítése a lap alján
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
        div.addEventListener('click', () => {
            SendRecipe(data[item]);
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

const SendRecipe = async (data) => {
    //! rákattintott recept nevének lementése backend-re, átirányítás a receptmegtekintő oldalra
    try {
        const postObject = { recept: data.nev };
        const message = await postAPI('/api/postrecept', postObject);
        console.log(message);
        document.location.href = `${data.kepnev.split('.')[0]}`;
    } catch (error) {
        console.error(error);
    }
};
