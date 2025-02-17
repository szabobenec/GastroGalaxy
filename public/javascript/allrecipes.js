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
        const data = (await getAPI('/api/getallrecept')).receptek;
        SelectType(data);
    } catch (error) {
        console.error(error);
    }
});

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
    console.log(tipusok);
    const divs = Array.from(document.getElementsByClassName('innerReceptek'));
    for (let item of divs) {
        for (let item2 in tipusok) {
            if (item2 == item.id) {
                MakeCards(tipusok[item2], item);
            }
        }
    }
};

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
        img.setAttribute('src', `../images/recipes/${item.source}`);
        img.setAttribute('class', 'littleImg');
    }
};

const SendRecipe = async (data) => {
    try {
        const postObject = { recept: data.nev };
        const message = await postAPI('/api/recept', postObject);
        console.log(message);
        document.location.href = `recipefullview/${data.source.split('.')[0]}`;
    } catch (error) {
        console.error(error);
    }
};
