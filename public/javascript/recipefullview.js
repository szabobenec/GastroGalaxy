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
    } catch (error) {
        console.error(error);
    }
});

const FillData = (data) => {
    console.log(data);
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
    console.log('hola');
    const receptLista = Array.from(document.getElementsByClassName('receptList'));
    for (let item of receptLista) {
        if (item.firstChild.checked) {
            item.lastChild.setAttribute('class', 'receptListLabel crossed');
        } else {
            item.lastChild.setAttribute('class', 'receptListLabel');
        }
    }
};
