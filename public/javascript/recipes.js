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

        const themeChanger = document.getElementById('themeChanger');
        themeChanger.addEventListener('change', () => {
            changeTheme(themeChanger);
        });
    } catch (error) {
        console.error(error);
    }
});

const changeTheme = (theme) => {
    if (theme.checked) {
        document.body.classList.add('dark-theme');
    } else {
        document.body.classList.remove('dark-theme');
    }
};

const MakeArray = (data) => {
    let hozzavalok = [];
    for (let item of data) {
        for (let item2 of item.hozzavalok) {
            for (let item3 in item2) {
                let contains = false;
                for (let i = 0; i < hozzavalok.length; i++) {
                    if (item3 == hozzavalok[i]) {
                        contains = true;
                    }
                }
                if (!contains) {
                    hozzavalok.push(item3);
                }
            }
        }
    }
    hozzavalok.sort((a, b) => a.localeCompare(b));
    // hozzavalok.sort(Intl.Collator().compare);
    FillSelect(hozzavalok);
};

const FillSelect = (data) => {
    const select = document.getElementById('hozzavalok');
    for (let item of data) {
        const option = document.createElement('option');
        select.appendChild(option);
        option.innerHTML = item;
        option.value = item;
    }
    const plusBtn = document.getElementById('addBtn');
    plusBtn.addEventListener('click', () => {
        AddNewForm(data);
    });
    document.getElementById('search').addEventListener('click', SearchRecipe);
};

const AddNewForm = (data) => {
    const fomrsDivs = Array.from(document.getElementsByClassName('formsDivs'));

    if (fomrsDivs.length < 5) {
        const innerForms = document.getElementById('innerForms');
        const div = document.createElement('div');
        innerForms.appendChild(div);
        div.setAttribute('class', 'formsDivs');

        const label = document.createElement('label');
        div.appendChild(label);
        label.for = 'hozzavalok';
        label.innerHTML = 'Hozzávalók:';

        const br = document.createElement('br');
        div.appendChild(br);

        const select = document.createElement('select');
        div.appendChild(select);
        select.name = 'hozzavalok';
        select.setAttribute('class', 'hozzavalok');

        const option0 = document.createElement('option');
        select.appendChild(option0);
        option0.value = 'zero';
        option0.innerHTML = '-- Válassz hozzávalót! --';
        for (let item of data) {
            const option = document.createElement('option');
            select.appendChild(option);
            option.innerHTML = item;
            option.value = item;
        }

        const button = document.createElement('input');
        div.appendChild(button);
        button.type = 'button';
        button.value = '-';
        button.id = 'removeBtn';
        button.addEventListener('click', () => {
            RemoveForm(div);
        });
    }
};

const RemoveForm = (div) => {
    const innerForms = document.getElementById('innerForms');
    innerForms.removeChild(div);
};

const SearchRecipe = async () => {
    try {
        const data = (await getAPI('/api/getallrecept')).receptek;
        const selects = Array.from(document.getElementsByClassName('hozzavalok'));
        let values = [];
        for (let item of selects) {
            if (!values.includes(item.value) && item.value !== 'zero') {
                values.push(item.value);
            }
        }
        let keresett = [];
        let keresett2 = [];
        if (values.length > 0) {
            for (let item of data) {
                let counter = 0;
                for (let item2 of item.hozzavalok) {
                    for (let item3 in item2) {
                        for (let hozzavalo of values) {
                            if (!keresett.includes(item) && item3 === hozzavalo) {
                                counter++;
                            }
                        }
                    }
                }
                if (counter == values.length) {
                    keresett.push(item);
                } else if (values.length > 2 && counter == values.length - 1) {
                    keresett2.push(item);
                }
            }
            fillDiv(keresett, keresett2);
        }
    } catch (error) {
        console.error(error);
    }
};

const fillDiv = (array1, array2) => {
    const teljes = document.getElementById('teljes');
    if (array1.length > 0) {
        teljes.setAttribute('class', '');
    }
    const reszleges = document.getElementById('reszleges');
    if (array2.length > 0) {
        reszleges.setAttribute('class', '');
    }

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

const SendRecipe = async (data) => {
    try {
        const postObject = { recept: data.nev };
        const message = await postAPI('/api/postrecept', postObject);
        console.log(message);
        document.location.href = '/recipefullview';
    } catch (error) {
        console.error(error);
    }
};
