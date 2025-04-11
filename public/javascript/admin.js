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

    const adatokDiv = document.createElement('div');
    mainDiv.appendChild(adatokDiv);
    adatokDiv.setAttribute('class', 'adatokDiv');
    adatokDiv.id = 'adatokDiv';
    BuildDiv(adatokDiv);
};

const BuildDiv = (adatokDiv) => {
    //! Szerkesztő-rész felépítése
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

    //? tipus
    const tipusDiv = document.createElement('div');
    adatokFormData.appendChild(tipusDiv);
    tipusDiv.setAttribute('class', 'formDiv');
    const tipusL = document.createElement('label');
    tipusDiv.appendChild(tipusL);
    tipusL.setAttribute('for', 'tipus');
    tipusL.innerHTML = 'Típus:';
    const tipusSelect = document.createElement('select');
    tipusDiv.appendChild(tipusSelect);
    tipusSelect.setAttribute('class', 'tipusSelect');
    tipusSelect.id = 'tipus';
    const option1 = document.createElement('option');
    tipusSelect.appendChild(option1);
    option1.value = 'reggeli';
    option1.innerHTML = 'reggeli';
    const option2 = document.createElement('option');
    tipusSelect.appendChild(option2);
    option2.value = 'leves';
    option2.innerHTML = 'leves';
    const option3 = document.createElement('option');
    tipusSelect.appendChild(option3);
    option3.value = 'főétel';
    option3.innerHTML = 'főétel';
    const option4 = document.createElement('option');
    tipusSelect.appendChild(option4);
    option4.value = 'desszert';
    option4.innerHTML = 'desszert';
    const option5 = document.createElement('option');
    tipusSelect.appendChild(option5);
    option5.value = 'egyéb';
    option5.innerHTML = 'egyéb';

    //? elkeszitesi ido
    const idoDiv = document.createElement('div');
    adatokFormData.appendChild(idoDiv);
    idoDiv.setAttribute('class', 'formDiv');
    const idoL = document.createElement('label');
    idoDiv.appendChild(idoL);
    idoL.setAttribute('for', 'ido');
    idoL.innerHTML = 'Elkészítési idő (perc):';
    const idoI = document.createElement('input');
    idoDiv.appendChild(idoI);
    idoI.type = 'text';
    idoI.id = 'ido';
    idoI.name = 'ido';
    idoI.placeholder = 'idő';
    idoI.setAttribute('class', 'adatInput');

    //? adag
    const adagDiv = document.createElement('div');
    adatokFormData.appendChild(adagDiv);
    adagDiv.setAttribute('class', 'formDiv');
    const adagL = document.createElement('label');
    adagDiv.appendChild(adagL);
    adagL.setAttribute('for', 'adag');
    adagL.innerHTML = 'Adag (fő):';
    const adagI = document.createElement('input');
    adagDiv.appendChild(adagI);
    adagI.type = 'text';
    adagI.id = 'adag';
    adagI.name = 'adag';
    adagI.placeholder = 'adag';
    adagI.setAttribute('class', 'adatInput');

    //? tagek
    const tagDiv = document.createElement('div');
    adatokFormData.appendChild(tagDiv);
    tagDiv.setAttribute('class', 'formDiv');
    const tagL = document.createElement('label');
    tagDiv.appendChild(tagL);
    tagL.setAttribute('for', 'tagek');
    tagL.innerHTML = `Tagek (';'-el elválasztva):`;
    const tagI = document.createElement('input');
    tagDiv.appendChild(tagI);
    tagI.type = 'text';
    tagI.id = 'tagek';
    tagI.name = 'tagek';
    tagI.placeholder = 'tagek';
    tagI.setAttribute('class', 'adatInput');

    //? hozzavalok
    const hozzavaloCim = document.createElement('h3');
    adatokFormData.appendChild(hozzavaloCim);
    hozzavaloCim.innerHTML = 'Hozzávalók';
    const hozzavalokDiv = document.createElement('div');
    adatokFormData.appendChild(hozzavalokDiv);
    hozzavalokDiv.setAttribute('class', 'formDivHozzavalo');
    hozzavalokDiv.id = 'hozzavalokDiv';
    const hozzavaloBtnsDiv = document.createElement('div');
    adatokFormData.appendChild(hozzavaloBtnsDiv);
    hozzavaloBtnsDiv.setAttribute('class', 'hozzavaloBtnsDiv');
    const hozzavaloAddBtn = document.createElement('input');
    hozzavaloBtnsDiv.appendChild(hozzavaloAddBtn);
    hozzavaloAddBtn.type = 'button';
    hozzavaloAddBtn.id = 'hozzavaloAddBtn';
    hozzavaloAddBtn.name = 'hozzavaloAddBtn';
    hozzavaloAddBtn.setAttribute('class', 'hozzavaloBtns');
    hozzavaloAddBtn.value = 'Plusz hozzávaló';
    hozzavaloAddBtn.addEventListener('click', AddHozzavalo);
    const hozzavaloRemoveBtn = document.createElement('input');
    hozzavaloBtnsDiv.appendChild(hozzavaloRemoveBtn);
    hozzavaloRemoveBtn.type = 'button';
    hozzavaloRemoveBtn.id = 'hozzavaloRemoveBtn';
    hozzavaloRemoveBtn.name = 'hozzavaloRemoveBtn';
    hozzavaloRemoveBtn.setAttribute('class', 'hozzavaloBtns');
    hozzavaloRemoveBtn.value = 'Utolsó hozzávaló törlése';
    hozzavaloRemoveBtn.addEventListener('click', RemoveHozzavalo);

    //? elkeszites
    const lepesCim = document.createElement('h3');
    adatokFormData.appendChild(lepesCim);
    lepesCim.innerHTML = 'Lépések';
    const lepesDiv = document.createElement('div');
    adatokFormData.appendChild(lepesDiv);
    lepesDiv.setAttribute('class', 'formDivLepes');
    lepesDiv.id = 'lepesDiv';
    const elkeszitesBtnsDiv = document.createElement('div');
    adatokFormData.appendChild(elkeszitesBtnsDiv);
    elkeszitesBtnsDiv.setAttribute('class', 'elkeszitesBtnsDiv');
    const elkeszitesAddBtn = document.createElement('input');
    elkeszitesBtnsDiv.appendChild(elkeszitesAddBtn);
    elkeszitesAddBtn.type = 'button';
    elkeszitesAddBtn.id = 'elkeszitesAddBtn';
    elkeszitesAddBtn.name = 'elkeszitesAddBtn';
    elkeszitesAddBtn.setAttribute('class', 'hozzavaloBtns');
    elkeszitesAddBtn.value = 'Plusz lépés';
    elkeszitesAddBtn.addEventListener('click', AddLepes);
    const elkeszitesRemoveBtn = document.createElement('input');
    elkeszitesBtnsDiv.appendChild(elkeszitesRemoveBtn);
    elkeszitesRemoveBtn.type = 'button';
    elkeszitesRemoveBtn.id = 'elkeszitesRemoveBtn';
    elkeszitesRemoveBtn.name = 'elkeszitesRemoveBtn';
    elkeszitesRemoveBtn.setAttribute('class', 'hozzavaloBtns');
    elkeszitesRemoveBtn.value = 'Utolsó lépés törlése';
    elkeszitesRemoveBtn.addEventListener('click', RemoveLepes);

    //? forras
    const forrasDiv = document.createElement('div');
    adatokFormData.appendChild(forrasDiv);
    forrasDiv.setAttribute('class', 'formDiv');
    const forrasL = document.createElement('label');
    forrasDiv.appendChild(forrasL);
    forrasL.setAttribute('for', 'forras');
    forrasL.innerHTML = 'Recept forrása:';
    const forrasI = document.createElement('input');
    forrasDiv.appendChild(forrasI);
    forrasI.type = 'text';
    forrasI.id = 'forras';
    forrasI.name = 'forras';
    forrasI.placeholder = 'forrás';
    forrasI.setAttribute('class', 'adatInput');

    //? kepnev
    const kepnevDiv = document.createElement('div');
    adatokFormData.appendChild(kepnevDiv);
    kepnevDiv.setAttribute('class', 'formDiv');
    const kepnevL = document.createElement('label');
    kepnevDiv.appendChild(kepnevL);
    kepnevL.setAttribute('for', 'kepnev');
    kepnevL.innerHTML = 'Kép neve:';
    const kepnevI = document.createElement('input');
    kepnevDiv.appendChild(kepnevI);
    kepnevI.type = 'text';
    kepnevI.id = 'kepnev';
    kepnevI.name = 'kepnev';
    kepnevI.placeholder = 'kép neve';
    kepnevI.setAttribute('class', 'adatInput');

    //? gombok
    const buttonDiv = document.createElement('div');
    adatokFormData.appendChild(buttonDiv);
    buttonDiv.setAttribute('class', 'formDivButtons');
    const updateBtn = document.createElement('input');
    buttonDiv.appendChild(updateBtn);
    updateBtn.type = 'button';
    updateBtn.id = 'updateBtn';
    updateBtn.name = 'updateBtn';
    updateBtn.value = 'Szerkesztés';
    updateBtn.setAttribute('class', 'buttons');
    const deleteBtn = document.createElement('input');
    buttonDiv.appendChild(deleteBtn);
    deleteBtn.type = 'button';
    deleteBtn.id = 'deleteBtn';
    deleteBtn.name = 'deleteBtn';
    deleteBtn.value = 'Törlés';
    deleteBtn.setAttribute('class', 'buttons');
};

//! Új hozzávaló div hozzáadása, ha több hozzávalóra lenne szükségünk
const AddHozzavalo = () => {
    const hozzavalokDiv = document.getElementById('hozzavalokDiv');

    const j = parseInt(hozzavalokDiv.lastChild.firstChild.id.split('-')[1]) + 1;

    console.log(j);

    const hozzavaloDiv = document.createElement('div');
    hozzavalokDiv.appendChild(hozzavaloDiv);
    hozzavaloDiv.setAttribute('class', 'formDiv');
    const hozzavaloI = document.createElement('input');
    hozzavaloDiv.appendChild(hozzavaloI);
    hozzavaloI.type = 'text';
    hozzavaloI.id = `hozzavalo-${j}`;
    hozzavaloI.name = `hozzavalo-${j}`;
    hozzavaloI.placeholder = 'hozzávaló';
    hozzavaloI.setAttribute('class', 'hozzavaloInput hozzavalo');
    const hozzavaloP = document.createElement('div');
    hozzavaloDiv.appendChild(hozzavaloP);
    hozzavaloP.innerHTML = ':';
    const mennyisegI = document.createElement('input');
    hozzavaloDiv.appendChild(mennyisegI);
    mennyisegI.type = 'text';
    mennyisegI.id = `mennyiseg-${j}`;
    mennyisegI.name = `mennyiseg-${j}`;
    mennyisegI.placeholder = 'mennyiség';
    mennyisegI.setAttribute('class', 'hozzavaloInput mennyiseg');
};

const RemoveLepes = () => {};

//! Utolsó hozzávaló div törlése, ha kevesebb hozzávalóra lenne szükségünk
const RemoveHozzavalo = () => {
    const hozzavalokDiv = document.getElementById('hozzavalokDiv');
    hozzavalokDiv.removeChild(hozzavalokDiv.lastChild);
};

const AddLepes = () => {
    const lepesDiv = document.getElementById('lepesDiv');

    const j = parseInt(lepesDiv.lastChild.firstChild.id.split('-')[1]) + 1;

    console.log(j);
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
    const formData = new FormData(document.getElementById('adatokFormData'));

    for (let [key, value] of formData) {
        formData.set(key, data[key]);
        document.getElementById(key).value = data[key];
    }

    document.getElementById('tipus').value = data.tipus;
    formData.append('tipus', data.tipus);

    const hozzavalokDiv = document.getElementById('hozzavalokDiv');
    hozzavalokDiv.innerHTML = '';

    const hozzavalok = JSON.parse(data.hozzavalok);

    let j1 = 0;
    for (let item in hozzavalok) {
        const hozzavaloDiv = document.createElement('div');
        hozzavalokDiv.appendChild(hozzavaloDiv);
        hozzavaloDiv.setAttribute('class', 'formDiv');
        const hozzavaloI = document.createElement('input');
        hozzavaloDiv.appendChild(hozzavaloI);
        hozzavaloI.type = 'text';
        hozzavaloI.id = `hozzavalo-${j1}`;
        hozzavaloI.name = `hozzavalo-${j1}`;
        hozzavaloI.placeholder = 'hozzávaló';
        hozzavaloI.setAttribute('class', 'hozzavaloInput hozzavalo');
        hozzavaloI.value = item;
        formData.set(`hozzavalo-${j1}`, item);
        const hozzavaloP = document.createElement('div');
        hozzavaloDiv.appendChild(hozzavaloP);
        hozzavaloP.innerHTML = ':';
        const mennyisegI = document.createElement('input');
        hozzavaloDiv.appendChild(mennyisegI);
        mennyisegI.type = 'text';
        mennyisegI.id = `mennyiseg-${j1}`;
        mennyisegI.name = `mennyiseg-${j1}`;
        mennyisegI.placeholder = 'mennyiség';
        mennyisegI.setAttribute('class', 'hozzavaloInput mennyiseg');
        mennyisegI.value = hozzavalok[item];
        formData.set(`mennyiseg-${j1}`, hozzavalok[item]);
        j1++;
    }

    const lepesDiv = document.getElementById('lepesDiv');
    lepesDiv.innerHTML = '';

    const lepesek = data.elkeszites;

    for (let item of lepesek.split('\n')) {
        const lepes = document.createElement('textArea');
        lepesDiv.appendChild(lepes);
        lepes.placeholder = 'Lépés leírása';
        lepes.setAttribute('class', 'lepes');
        lepes.id = `lepes-${item.slice(0, 1)}`;
        const text = item.slice(3);
        lepes.innerHTML = text;
    }

    document.getElementById('updateBtn').addEventListener('click', () => {
        UpdateRecipe(data);
    });
    document.getElementById('deleteBtn').addEventListener('click', () => {
        DeleteRecipe(data);
    });
};

const UpdateRecipe = async (data) => {
    const formData = new FormData(document.getElementById('adatokFormData'));

    formData.append('id', data.id);
    formData.append('tipus', document.getElementById('tipus').value);

    let j1 = 0;
    let j2 = 0;
    let hozzavalo = [];
    let mennyiseg = [];
    let deleted = [];
    for (let [key, value] of formData) {
        if (key == `hozzavalo-${j1}`) {
            if (value !== '') {
                hozzavalo.push(value);
            }
            deleted.push(key);
            j1++;
        }
        if (key == `mennyiseg-${j2}`) {
            if (value !== '') {
                mennyiseg.push(value);
            }
            deleted.push(key);
            j2++;
        }
    }
    for (let item of deleted) {
        formData.delete(item);
    }

    let hozzavalok = [];
    for (let i = 0; i < hozzavalo.length; i++) {
        hozzavalok.push({
            [hozzavalo[i]]: mennyiseg[i]
        });
    }

    formData.append('hozzavalok', JSON.stringify(hozzavalok));

    const lepesek = Array.from(document.getElementsByClassName('lepes'));
    let lepesekArray = [];
    for (let item of lepesek) {
        lepesekArray.push(`${item.id.split('-')[1]}. ${item.innerHTML}`);
    }
    const elkeszites = lepesekArray.join('\n');
    formData.append('elkeszites', elkeszites);

    let checker = true;
    for (let [key, value] of formData) {
        if (!value) {
            checker = false;
        }
    }

    if (checker) {
        try {
            const data = await postAPIFormData('/api/update-recept', formData);

            if (data.messag !== 'Hiba') {
                Swal.fire({
                    title: 'Sikeres módosítás!',
                    text: 'Recept sikeresen szerkesztve!',
                    icon: 'success'
                });

                const adatokDiv = document.getElementById('adatokDiv');
                adatokDiv.innerHTML = '';
                BuildDiv(adatokDiv);

                document.getElementById('receptekDiv').innerHTML = '';
                const receptek = (await getAPI('/api/getallrecept')).response;
                OrderRecipes(receptek);
            } else {
                Swal.fire({
                    title: 'Hiba!',
                    text: 'Valami hiba történt!',
                    icon: 'error'
                });
            }
        } catch (error) {
            console.error(error);
        }
    }
};

const DeleteRecipe = async (data) => {
    const id = data.id;
    try {
        const postObject = { id: id };
        const data = await postAPI('/api/delete-recept', postObject);
        console.log(data);
        if (data.message !== 'Hiba') {
            Swal.fire({
                title: 'Sikeres törlés!',
                text: 'Recept sikeresen törölve az adatbázisból!',
                icon: 'success'
            });

            const adatokDiv = document.getElementById('adatokDiv');
            adatokDiv.innerHTML = '';
            BuildDiv(adatokDiv);

            document.getElementById('receptekDiv').innerHTML = '';
            const receptek = (await getAPI('/api/getallrecept')).response;
            OrderRecipes(receptek);
        } else {
            Swal.fire({
                title: 'Hiba!',
                text: 'Valami hiba történt!',
                icon: 'error'
            });
        }
    } catch (error) {
        console.error(error);
    }
};
