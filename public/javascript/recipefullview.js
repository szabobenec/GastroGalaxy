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
    const tovabbiReceptek = document.getElementById('tovabbiReceptek');
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
        tovabbiReceptek.appendChild(div);
        div.setAttribute('class', 'randomRecipes grow');

        const a = document.createElement('a');
        div.appendChild(a);
        a.href = 'recipefullview';
        a.setAttribute('class', 'receptLink');
        const titleDiv = document.createElement('div');
        a.appendChild(titleDiv);
        const svg = document.createElement('svg');
        titleDiv.appendChild(svg);
        svg.setAttribute('width', '33px');
        svg.setAttribute('height', '33px');
        svg.setAttribute('viewBox', '0 0 24 24');
        svg.setAttribute('fill', 'none');
        svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
        const path = document.createElement('path');
        svg.appendChild(path);
        path.setAttribute(
            'd',
            'M20 4L12 12M20 4V8.5M20 4H15.5M19 12.5V16.8C19 17.9201 19 18.4802 18.782 18.908C18.5903 19.2843 18.2843 19.5903 17.908 19.782C17.4802 20 16.9201 20 15.8 20H7.2C6.0799 20 5.51984 20 5.09202 19.782C4.71569 19.5903 4.40973 19.2843 4.21799 18.908C4 18.4802 4 17.9201 4 16.8V8.2C4 7.0799 4 6.51984 4.21799 6.09202C4.40973 5.71569 4.71569 5.40973 5.09202 5.21799C5.51984 5 6.07989 5 7.2 5H11.5'
        );
        path.setAttribute('stroke', '#FFFFFF');
        path.setAttribute('stroke-width', '2');
        path.setAttribute('stroke-linecap', 'round');
        path.setAttribute('stroke-linejoin', 'round');
        a.addEventListener('click', () => {
            SendRecept(data[item]);
        });

        const h3 = document.createElement('h3');
        titleDiv.appendChild(h3);
        h3.innerHTML = data[item].nev;
        const p = document.createElement('p');
        div.appendChild(p);
        p.innerHTML = 'Hozzávalók:<br>';
        p.style.width = '90%';
        for (let item2 of data[item].hozzavalok) {
            for (let hozzavalo in item2) {
                p.innerHTML += `${hozzavalo}; `;
            }
        }
    }
};

const SendRecept = async (data) => {
    try {
        const postObject = { recept: data.nev };
        const message = await postAPI('/api/recept', postObject);
        console.log(message);
    } catch (error) {
        console.reject(error);
    }
};
