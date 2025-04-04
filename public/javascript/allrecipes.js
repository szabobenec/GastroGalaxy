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
    try {
        const data = (await getAPI('/api/getallrecept')).response;
        OrderRecipes(data);

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

//! Témaváltáshoz használt függvény
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

//! Receptek abc sorrendbe rendezése, az egyszerűbb megtalálás érdekében
const OrderRecipes = (data) => {
    let names = [];
    for (let item of data) {
        names.push(item.nev);
    }
    names.sort((a, b) => a.localeCompare(b));

    let newData = [];
    let i = 0;
    while (newData.length < data.length) {
        let j = 0;
        while (j < data.length && data[j].nev !== names[i]) {
            j++;
        }
        i++;
        newData.push(data[j]);
    }
    SelectType(newData);
};

//! Típusonként való elosztás/elrendezés
const SelectType = (data) => {
    let tipusok = { reggeli: [], leves: [], foetel: [], vacsora: [], desszert: [] };
    for (let item of data) {
        if (item.tipus === 'reggeli') {
            tipusok.reggeli.push(item);
        } else if (item.tipus === 'leves') {
            tipusok.leves.push(item);
        } else if (item.tipus === 'főétel') {
            tipusok.foetel.push(item);
        } else if (item.tipus === 'vacsora') {
            tipusok.vacsora.push(item);
        } else if (item.tipus === 'desszert') {
            tipusok.desszert.push(item);
        }
    }
    // console.log(tipusok); //* Receptek konzolon való kiírása, típusok alapján
    const divs = Array.from(document.getElementsByClassName('innerReceptek'));
    for (let item of divs) {
        for (let item2 in tipusok) {
            if (item2 == item.id) {
                MakeCards(tipusok[item2], item);
            }
        }
    }
};

//! Kártyák létrehozása - dizájnolással
const MakeCards = (data, receptDiv) => {
    for (let item of data) {
        const div = document.createElement('div');
        receptDiv.appendChild(div);
        div.setAttribute('class', 'receptDiv grow');
        div.addEventListener('click', () => {
            SendRecipe(item);
        });

        const titleDiv = document.createElement('div');
        div.appendChild(titleDiv);
        titleDiv.setAttribute('class', 'titleDiv');

        const h3 = document.createElement('h3');
        titleDiv.appendChild(h3);
        h3.innerHTML = item.nev;

        const img = document.createElement('img');
        div.appendChild(img);
        img.setAttribute('src', `../images/recipes/${item.kepnev}`);
        img.setAttribute('class', 'littleImg');
    }
};

//! Rákattintott recept nevének lementése backend-re, átirányítás a receptmegtekintő oldalra
const SendRecipe = async (data) => {
    try {
        const postObject = { recept: data.nev };
        const message = await postAPI('/api/postrecept', postObject);
        console.log(message);
        document.location.href = `recipefullview/${data.kepnev.split('.')[0]}`;
    } catch (error) {
        console.error(error);
    }
};
