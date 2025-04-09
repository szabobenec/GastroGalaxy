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
        //? Receptek lekérése, azok sorbarendezése; illetve hozzávalók neveinek összegyűjtése, elrendezése
        const data = (await getAPI('/api/getallrecept')).response;
        MakeHozzavalokArray(data);
        OrderRecipes(data);
        MakeTagArray(data);
        document.getElementById('recipeSearchBar').addEventListener('input', function () {
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
        await postAPI('/api/savetheme', postObject);
    } catch (error) {
        console.error(error);
    }
};

//TODO Receptek

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
    FillRecipesDiv(newData);
};

//! Receptes div feltöltése
const FillRecipesDiv = (data) => {
    const receptekDiv = document.getElementById('receptekDiv');
    for (let item of data) {
        const div = document.createElement('div');

        receptekDiv.appendChild(div);
        div.setAttribute('class', 'receptDivs grow hide');
        //? Rákattintott recept oldalára való továbbküldés
        div.addEventListener('click', () => {
            document.location.href = `/recipefullview/${item.kepnev.split('.')[0]}`;
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

//TODO Hozzávalók

//! Hozzávalók lista létrehozása - ismétlődés nélkül, abc sorban
const MakeHozzavalokArray = (data) => {
    let hozzavalok = [];
    for (let item of data) {
        let tempHozzavalok = JSON.parse(item.hozzavalok);
        for (let element in tempHozzavalok) {
            if (!hozzavalok.includes(element)) {
                hozzavalok.push(element);
            }
        }
    }
    //? Sorbarendezés
    hozzavalok.sort((a, b) => a.localeCompare(b));
    // hozzavalok.sort(Intl.Collator().compare);

    FillHozzavaloDiv(hozzavalok);
    document.getElementById('searchBar').addEventListener('input', function () {
        UpdateHozzavaloSearch(this, hozzavalok);
    });
};

//! Két div feltöltése a hozzávalók neveikkel - kártyákon való megjelenítés
const FillHozzavaloDiv = (data) => {
    //? Kereséshez használt kártyák - alapértelmezetten rejtve
    const hozzavalokDiv = document.getElementById('hozzavalokDiv');
    for (let item of data) {
        const div = document.createElement('div');
        hozzavalokDiv.appendChild(div);
        div.innerHTML = item;
        div.setAttribute('class', 'card grow2 hide');
        div.addEventListener('click', () => {
            AddHozzavalo(div, hozzavalokDiv);
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
            AddHozzavalo(div, hozzavalokDiv);
        });
    }
};

//! Keresés frissítése - bármely bevitel esetén
const UpdateHozzavaloSearch = (elem, data) => {
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
const AddHozzavalo = (div, hozzavalokDiv) => {
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
    UpdateHozzavaloRecipes();
    document.getElementById('searchBar').value = '';
    for (let item of hozzavalokDiv.children) {
        item.classList.add('hide');
    }
};

//! Kiválasztott hozzávalók közül való eltávolítás
const RemoveHozzavalo = (div, hozzavalok) => {
    hozzavalok.removeChild(div);
    UpdateHozzavaloRecipes();
};

//! Hozzávalók alapján talált, megjelenített receptek frissítése
const UpdateHozzavaloRecipes = async () => {
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
        }
        FillDivsHozzavalo(keresett, keresett2);
    } catch (error) {
        console.error(error);
    }
};

//! Receptek megjelenítése - dizájnolva
const FillDivsHozzavalo = (array1, array2) => {
    //? Amennyiben az összes kiválasztott hozzávalót tartalmazza, úgy a 'teljes' div-ben kerül megjelenítésre
    const div1 = document.getElementById('teljesDiv');
    div1.innerHTML = '';
    for (let item of array1) {
        const div = document.createElement('div');
        div1.appendChild(div);
        div.setAttribute('class', 'receptDivs grow');
        //? Rákattintott recept oldalára való továbbküldés
        div.addEventListener('click', () => {
            document.location.href = `/recipefullview/${item.kepnev.split('.')[0]}`;
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
        //? Rákattintott recept oldalára való továbbküldés
        div.addEventListener('click', () => {
            document.location.href = `/recipefullview/${item.kepnev.split('.')[0]}`;
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

//TODO Tagek

//! Tagek lista létrehozása - ismétlődés nélkül, abc sorban
const MakeTagArray = (data) => {
    let tagek = [];
    for (let item of data) {
        for (let element of item.tagek.split(';')) {
            if (!tagek.includes(element) && element !== '') {
                tagek.push(element);
            }
        }
    }
    //? Sorbarendezés
    tagek.sort((a, b) => a.localeCompare(b));

    console.log(tagek);
    FillTagDiv(tagek);

    document.getElementById('tagSearchBar').addEventListener('input', function () {
        UpdateTagSearch(this, tagek);
    });
};

//! Két div feltöltése a tagek neveivel - kártyákon való megjelenítés
const FillTagDiv = (data) => {
    //? Kereséshez használt kártyák - alapértelmezetten rejtve
    const tagsDiv = document.getElementById('tagsDiv');
    for (let item of data) {
        const div = document.createElement('div');
        tagsDiv.appendChild(div);
        div.innerHTML = item;
        div.setAttribute('class', 'card grow2 hide');
        div.addEventListener('click', () => {
            AddTag(div, tagsDiv);
        });
    }

    //? Lap alján látható összes tag rész
    const osszesTag = document.getElementById('osszesTag');
    for (let item of data) {
        const div = document.createElement('div');
        osszesTag.appendChild(div);
        div.innerHTML = item;
        div.setAttribute('class', 'card grow2');
        div.addEventListener('click', () => {
            AddTag(div, tagsDiv);
        });
    }
};

//! Keresés frissítése - bármely bevitel esetén
const UpdateTagSearch = (elem, data) => {
    const tagsDiv = document.getElementById('tagsDiv');
    const value = elem.value.toLowerCase();

    for (let item of tagsDiv.children) {
        const isVisible = item.innerHTML.includes(value);
        item.classList.toggle('hide', !isVisible);
        if (value == '') {
            item.classList.add('hide');
        }
    }

    //? Nem keresett tagek elrejtése
    if (value == '') {
        for (let item of tagsDiv.children) {
            item.classList.add('hide');
        }
    }
};

//! Kiválasztott tag hozzáadása a keresett hozzávalókhoz
const AddTag = (div, tagsDiv) => {
    const tags = document.getElementById('tags');

    //? Annak ellenőrzése, hogy már szerepel-e a kiválasztottak között
    let contains = false;
    for (let item of tags.children) {
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
        tags.appendChild(newDiv);
        newDiv.innerHTML = div.innerHTML + ' X';
        newDiv.setAttribute('class', 'card grow2');

        newDiv.addEventListener('click', () => {
            RemoveTag(newDiv, tags);
        });
    }
    UpdateTagRecipes();
    document.getElementById('tagSearchBar').value = '';
    for (let item of tagsDiv.children) {
        item.classList.add('hide');
    }
};

//! Kiválasztott tagek közül való eltávolítás
const RemoveTag = (div, hozzavalok) => {
    hozzavalok.removeChild(div);
    UpdateTagRecipes();
};

//! Tagek alapján talált, megjelenített receptek frissítése
const UpdateTagRecipes = async () => {
    try {
        const div = document.getElementById('tags');
        let tagek = [];
        for (let item of div.children) {
            let temp = [];
            for (let item2 of item.innerHTML.split(' ')) {
                temp.push(item2);
            }
            temp.pop();
            tagek.push(temp.join(' '));
        }
        // console.log(tagek);

        const data = (await getAPI('/api/getallrecept')).response;

        //? Recept tagjei egyezésének ellenőrzése
        let keresett = [];
        let keresett2 = [];
        if (tagek.length > 0) {
            for (let item of data) {
                let counter = 0;
                for (let item2 of item.tagek.split(';')) {
                    for (let item3 of tagek) {
                        if (!keresett.includes(item) && item2 === item3) {
                            counter++;
                        }
                    }
                }
                console.log(counter);

                if (counter == tagek.length) {
                    keresett.push(item);
                } else if (tagek.length > 1 && counter == tagek.length - 1) {
                    keresett2.push(item);
                }
            }

            // console.log(keresett);
            // console.log(keresett2);
        }
        FillDivsTag(keresett, keresett2);
    } catch (error) {
        console.error(error);
    }
};

//! Receptek megjelenítése - dizájnolva
const FillDivsTag = (array1, array2) => {
    //? Amennyiben az összes kiválasztott hozzávalót tartalmazza, úgy a 'teljes' div-ben kerül megjelenítésre
    const div1 = document.getElementById('teljesTagsDiv');
    div1.innerHTML = '';
    for (let item of array1) {
        const div = document.createElement('div');
        div1.appendChild(div);
        div.setAttribute('class', 'receptDivs grow');
        //? Rákattintott recept oldalára való továbbküldés
        div.addEventListener('click', () => {
            document.location.href = `/recipefullview/${item.kepnev.split('.')[0]}`;
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
    const div2 = document.getElementById('reszlegesTagsDiv');
    div2.innerHTML = '';
    for (let item of array2) {
        const div = document.createElement('div');
        div2.appendChild(div);
        div.setAttribute('class', 'receptDivs grow');
        //? Rákattintott recept oldalára való továbbküldés
        div.addEventListener('click', () => {
            document.location.href = `/recipefullview/${item.kepnev.split('.')[0]}`;
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
