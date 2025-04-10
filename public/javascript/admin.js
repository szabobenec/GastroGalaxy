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

//! POST FormData metódus
const postAPIFormData = (url, formData) => {
    return new Promise((resolve, reject) => {
        fetch(url, {
            method: 'POST',
            body: formData
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
        console.log('Welcome to the admin page!');
        //?
        document.getElementById('loginBtn').addEventListener('click', Login);

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

const Login = async () => {
    try {
        const formData = new FormData(document.getElementById('formData'));

        const data = await postAPIFormData('/api/login/admin', formData);
        console.log(data);

        if (data.response) {
            Swal.fire({
                title: 'Üdvözlégy, admin!',
                text: 'Sikeres bejelentkezés!',
                icon: 'success'
            });
            ShowData();
        } else {
            Swal.fire({
                title: 'Sikertelen bejelentkezés!',
                text: 'Hibás felhasználónév vagy jelszó!',
                icon: 'error'
            });
        }
    } catch (error) {
        console.error(error);
    }
};

//! Receptkereső rész megjelenítése
const ShowData = async () => {
    //! Kereső rész felépítése
    const mainDiv = document.getElementById('mainDiv');
    const loginDiv = document.getElementById('loginDiv');
    mainDiv.removeChild(loginDiv);

    const adminDiv = document.createElement('div');
    mainDiv.appendChild(adminDiv);
    adminDiv.setAttribute('class', 'adminDiv');
    const adminInnerDiv = document.createElement('div');
    adminDiv.appendChild(adminInnerDiv);
    adminInnerDiv.setAttribute('class', 'adminInnerDiv');

    const h1 = document.createElement('h1');
    adminInnerDiv.appendChild(h1);
    h1.innerHTML = 'Recept kiválasztása:';
    h1.setAttribute('class', 'kivalasztCim');
    const h2 = document.createElement('h2');
    adminInnerDiv.appendChild(h2);
    h2.innerHTML = 'Receptkereső:';
    const searchDiv = document.createElement('div');
    adminInnerDiv.appendChild(searchDiv);
    searchDiv.id = 'searchDiv';
    searchDiv.setAttribute('class', 'formsDiv');

    const formDataSearch = document.createElement('form');
    searchDiv.appendChild(formDataSearch);
    formDataSearch.id = 'formDataSearch';
    const innerFormDataSearch = document.createElement('div');
    formDataSearch.appendChild(innerFormDataSearch);
    innerFormDataSearch.setAttribute('class', 'innerFormDataSearch');
    const receptekDiv = document.createElement('div');
    formDataSearch.appendChild(receptekDiv);
    receptekDiv.id = 'receptekDiv';
    receptekDiv.setAttribute('class', 'receptekDiv');

    const label = document.createElement('label');
    innerFormDataSearch.appendChild(label);
    label.setAttribute('for', 'recipeSearch');
    label.innerHTML = 'Recept neve: ';
    const input = document.createElement('input');
    innerFormDataSearch.appendChild(input);
    input.type = 'search';
    input.name = 'recipeSearch';
    input.id = 'recipeSearch';
    input.placeholder = 'Keresés . . .';

    const data = (await getAPI('/api/getallrecept')).response;
    OrderRecipes(data);
    document.getElementById('recipeSearch').addEventListener('input', function () {
        SearchRecipe(this, data);
    });

    //TODO Itt kell létrehozni a szeresztő részt

    // <div class="adatokDiv">
    //     <form id="adatokFormData" class="adatokFormData">
    //         <div class="formDiv">
    //             <label for="">: </label>
    //             <input type="text" id="" name="" placeholder="" />
    //         </div>

    //         <div class="formDiv">
    //             <label for="">: </label>
    //             <input type="text" id="" name="" placeholder="" />
    //         </div>
    //     </form>
    // </div>;

    //! Szerkesztő-rész felépítése
    const adatokDiv = document.createElement('div');
    mainDiv.appendChild(adatokDiv);
    adatokDiv.setAttribute('class', 'adatokDiv');
    const h1Adatok = document.createElement('h1');
    adatokDiv.appendChild(h1Adatok);
    h1Adatok.innerHTML = 'Adatok szerkesztése:';
    const adatokFormData = document.createElement('form');
    adatokDiv.appendChild(adatokFormData);
    adatokFormData.id = 'adatokFormData';
    adatokFormData.setAttribute('class', 'adatokFormData');

    //? nev
    const nevDiv = document.createElement('div');
    adatokFormData.appendChild(nevDiv);
    nevDiv.setAttribute('class', 'formDiv');
    const nevL = document.createElement('label');
    nevDiv.appendChild(nevL);
    nevL.setAttribute('for', 'nev');
    nevL.innerHTML = 'Recept neve:';
    const nevI = document.createElement('input');
    nevDiv.appendChild(nevI);
    nevI.type = 'text';
    nevI.id = 'nev';
    nevI.name = 'nev';
    nevI.placeholder = 'név';
    nevI.setAttribute('class', 'adatInput');

    //! TIPUS
    //? tipus

    //? elkeszitesi ido
    const nevDiv = document.createElement('div');
    adatokFormData.appendChild(nevDiv);
    nevDiv.setAttribute('class', 'formDiv');
    const nevL = document.createElement('label');
    nevDiv.appendChild(nevL);
    nevL.setAttribute('for', 'nev');
    nevL.innerHTML = 'Recept neve:';
    const nevI = document.createElement('input');
    nevDiv.appendChild(nevI);
    nevI.type = 'text';
    nevI.id = 'nev';
    nevI.name = 'nev';
    nevI.placeholder = 'név';
    nevI.setAttribute('class', 'adatInput');
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
            ManageRecipe(item);
            for (let item of receptekDiv.children) {
                item.classList.add('hide');
            }
            document.getElementById('recipeSearch').value = '';
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

const ManageRecipe = (data) => {
    console.log(data);
};
