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
        MakeArray(data);
        FillRecipesDiv(data);
        document.getElementById('searchBar0').addEventListener('input', function () {
            SearchRecipe(this, data);
        });

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
        // console.log(data);
    } catch (error) {
        console.error(error);
    }
};

//! Receptes div feltöltése
const FillRecipesDiv = (data) => {
    const receptekDiv = document.getElementById('receptekDiv');
    for (let item of data) {
        const div = document.createElement('div');

        receptekDiv.appendChild(div);
        div.setAttribute('class', 'receptDivs grow hide');
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

//! Receptre keresés
const SearchRecipe = (elem, data) => {
    const receptekDiv = document.getElementById('receptekDiv');
    const value = elem.value.toLowerCase();

    for (let item of receptekDiv.children) {
        const isVisible = item.firstChild.firstChild.innerHTML.toLowerCase().includes(value);
        item.classList.toggle('hide', !isVisible);
        if (value == '') {
            item.classList.add('hide');
        }
    }

    if (value == '') {
        for (let item of receptekDiv.children) {
            item.classList.add('hide');
        }
    }
};

//! Hozzávalók lista létrehozása - ismétlődés nélkül, abc sorban
const MakeArray = (data) => {
    let hozzavalok = [];
    for (let item of data) {
        let tempHozzavalok = JSON.parse(item.hozzavalok);
        for (let element in tempHozzavalok) {
            let contains = false;
            for (let temp of hozzavalok) {
                if (temp == element) {
                    contains = true;
                }
            }
            if (!contains) {
                hozzavalok.push(element);
            }
        }
    }
    //? Sorbarendezés
    hozzavalok.sort((a, b) => a.localeCompare(b));
    // hozzavalok.sort(Intl.Collator().compare);

    FillDiv(hozzavalok);
    document.getElementById('searchBar').addEventListener('input', function () {
        UpdateSearch(this, hozzavalok);
    });
};

//! Két div feltöltése a hozzávalók neveikkel - kártyákon való megjelenítés
const FillDiv = (data) => {
    //? Kereséshez használt kártyák - alapértelmezetten rejtve
    const hozzavalokDiv = document.getElementById('hozzavalokDiv');
    for (let item of data) {
        const div = document.createElement('div');
        hozzavalokDiv.appendChild(div);
        div.innerHTML = item;
        div.setAttribute('class', 'card grow2 hide');
        div.addEventListener('click', () => {
            AddHozzavalo(div);
        });
    }

    //? Lap alján látható összes hozzávaló rész
    const osszesHozzavalo = document.getElementById('osszesHozzavalo');
    for (let item of data) {
        const div = document.createElement('div');
        osszesHozzavalo.appendChild(div);
        div.innerHTML = item;
        div.setAttribute('class', 'card grow2');
        div.addEventListener('click', () => {
            AddHozzavalo(div);
        });
    }
};

//! Keresés frissítése - bármely bevitel esetén
const UpdateSearch = (elem, data) => {
    const hozzavalokDiv = document.getElementById('hozzavalokDiv');
    const value = elem.value.toLowerCase();

    for (let item of hozzavalokDiv.children) {
        const isVisible = item.innerHTML.includes(value);
        item.classList.toggle('hide', !isVisible);
        if (value == '') {
            item.classList.add('hide');
        }
    }

    //? Nem keresett hozzávalók elrejtése
    if (value == '') {
        for (let item of hozzavalokDiv.children) {
            item.classList.add('hide');
        }
    }
};

//! Kiválasztott hozzávaló hozzáadása a keresett hozzávalókhoz
const AddHozzavalo = (div) => {
    const hozzavalok = document.getElementById('hozzavalok');

    //? Annak ellenőrzése, hogy már szerepel-e a kiválasztottak között
    let contains = false;
    for (let item of hozzavalok.children) {
        let temp = [];
        for (let item2 of item.innerHTML.split(' ')) {
            temp.push(item2);
        }
        temp.pop();
        let name = temp.join(' ');

        if (name == div.innerHTML) {
            contains = true;
        }
    }

    if (!contains) {
        const newDiv = document.createElement('div');
        hozzavalok.appendChild(newDiv);
        newDiv.innerHTML = div.innerHTML + ' X';
        newDiv.setAttribute('class', 'card grow2');

        newDiv.addEventListener('click', () => {
            RemoveHozzavalo(newDiv, hozzavalok);
        });
    }
    UpdateRecipes();
    document.getElementById('searchBar').value = '';
    for (let item of hozzavalokDiv.children) {
        item.classList.add('hide');
    }
};

//! Kiválasztott hozzávalók közül való eltávolítás
const RemoveHozzavalo = (div, hozzavalok) => {
    hozzavalok.removeChild(div);
    UpdateRecipes();
};

//! Hozzávalük alapján talált, megjelenített receptek frissítése
const UpdateRecipes = async () => {
    try {
        const div = document.getElementById('hozzavalok');
        let hozzavalok = [];
        for (let item of div.children) {
            let temp = [];
            for (let item2 of item.innerHTML.split(' ')) {
                temp.push(item2);
            }
            temp.pop();
            hozzavalok.push(temp.join(' '));
        }
        // console.log(hozzavalok);

        const data = (await getAPI('/api/getallrecept')).response;

        //? Recept hozzávalói egyezésének ellenőrzése
        let keresett = [];
        let keresett2 = [];
        if (hozzavalok.length > 0) {
            for (let item of data) {
                let counter = 0;
                let hozzavalo = JSON.parse(item.hozzavalok);

                for (let item2 in hozzavalo) {
                    for (let item3 of hozzavalok) {
                        if (!keresett.includes(item) && item2 === item3) {
                            counter++;
                        }
                    }
                }
                if (counter == hozzavalok.length) {
                    keresett.push(item);
                } else if (hozzavalok.length > 1 && counter == hozzavalok.length - 1) {
                    keresett2.push(item);
                }
            }

            // console.log(keresett);
            // console.log(keresett2);
            fillDivs(keresett, keresett2);
        }
    } catch (error) {
        console.error(error);
    }
};

//! Receptek megjelenítése - dizájnolva
const fillDivs = (array1, array2) => {
    const teljes = document.getElementById('teljes');
    if (array1.length > 0) {
        teljes.setAttribute('class', '');
    }
    const reszleges = document.getElementById('reszleges');
    if (array2.length > 0) {
        reszleges.setAttribute('class', '');
    }

    //? Amennyiben az összes kiválasztott hozzávalót tartalmazza, úgy a 'teljes' div-ben kerül megjelenítésre
    const div1 = document.getElementById('teljesDiv');
    div1.innerHTML = '';
    for (let item of array1) {
        const div = document.createElement('div');
        div1.appendChild(div);
        div.setAttribute('class', 'receptDivs grow');
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

    //? Amennyiben nem az összes, de több, mint egy hozzávalót tartalmaz, úgy a 'reszleges' div-ben kerül megjelenítésre
    const div2 = document.getElementById('reszlegesDiv');
    div2.innerHTML = '';
    for (let item of array2) {
        const div = document.createElement('div');
        div2.appendChild(div);
        div.setAttribute('class', 'receptDivs grow');
        div.addEventListener('click', () => {
            SendRecipe(item);
        });

        const titleDiv = document.createElement('div');
        div.appendChild(titleDiv);
        titleDiv.setAttribute('class', 'titleDiv');

        const h3 = document.createElement('h3');
        titleDiv.appendChild(h3);
        h3.style.width = '90%';
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
        document.location.href = `/recipefullview/${data.kepnev.split('.')[0]}`;
    } catch (error) {
        console.error(error);
    }
};
