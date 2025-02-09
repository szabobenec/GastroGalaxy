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
    try {
        const data = (await getAPI('/api/getallrecept')).receptek;
        const receptNev = await getAPI('/api/recept');
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
    const receptNev = document.getElementById('receptNev');
    receptNev.innerHTML = data.nev;
    const receptIdo = document.getElementById('receptIdo');
    receptIdo.innerHTML = data.ido;
    const receptAdag = document.getElementById('receptAdag');
    receptAdag.innerHTML = data.adag;
    const receptTipus = document.getElementById('receptTipus');
    receptTipus.innerHTML = data.tipus;

    const receptHozzavalok = document.getElementById('hozzavalok');
    for (let item of data.hozzavalok) {
        let hozzavaloNeve = '';
        for (let item2 in item) {
            hozzavaloNeve = item2;
        }
        const div = document.createElement('div');
        receptHozzavalok.appendChild(div);
        div.setAttribute('class', 'receptList');
        const input = document.createElement('input');
        div.appendChild(input);
        input.type = 'checkbox';
        input.id = hozzavaloNeve;
        const label = document.createElement('label');
        div.appendChild(label);
        label.for = hozzavaloNeve;
        label.innerHTML = `${hozzavaloNeve}: ${item[hozzavaloNeve]}`;
        label.setAttribute('class', 'receptListLabel');

        input.addEventListener('change', CrossWords);
    }

    const receptElkeszites = document.getElementById('receptElkeszites');
    for (let item of data.elkeszites.split('\n')) {
        const p = document.createElement('p');
        receptElkeszites.appendChild(p);
        p.innerHTML = item;
    }

    const receptForras = document.getElementById('receptForras');
    receptForras.innerHTML = data.forras;

    const receptKep = document.getElementById('receptKep');
    receptKep.setAttribute('src', `../images/recipes/${data.source}`);
};

const CrossWords = () => {
    const receptLista = Array.from(document.getElementsByClassName('receptList'));
    for (let item of receptLista) {
        if (item.firstChild.checked) {
            item.lastChild.setAttribute('class', 'receptListLabel crossed');
        } else {
            item.lastChild.setAttribute('class', 'receptListLabel');
        }
    }
};

const RandomRecipes = (data, recept) => {
    const randomReceptek = document.getElementById('randomReceptek');
    let indexek = [];
    let index = 0;

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
        // h3.style.width = '90%';
        // const p = document.createElement('p');
        // div.appendChild(p);
        // p.innerHTML = 'Hozzávalók:<br>';
        // p.style.width = '90%';
        // for (let item2 of data[item].hozzavalok) {
        //     for (let hozzavalo in item2) {
        //         p.innerHTML += `${hozzavalo}; `;
        //     }
        // }

        const img = document.createElement('img');
        div.appendChild(img);
        img.setAttribute('src', `../images/recipes/${data[item].source}`);
        img.setAttribute('class', 'littleImg');
    }
};

const SendRecipe = async (data) => {
    try {
        const postObject = { recept: data.nev };
        const message = await postAPI('/api/recept', postObject);
        console.log(message);
        document.location.href = 'recipefullview';
    } catch (error) {
        console.error(error);
    }
};
