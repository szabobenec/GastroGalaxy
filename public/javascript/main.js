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
    console.log('Welcome to Gastro Galaxy!');
    try {
        const data = (await getAPI('/api/getallrecept')).response;
        const receptNev = await getAPI('/api/getrecept');
        let random = Math.floor(Math.random() * (data.length - 1 - 0 + 1) + 0);
        let recept = data[random];
        for (let item of data) {
            if (item.nev == receptNev.recept) {
                recept = item;
            }
        }
        RandomRecipes(data, recept);
    } catch (error) {
        console.error(error);
    }
});

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

        const img = document.createElement('img');
        div.appendChild(img);
        img.setAttribute('src', `../images/recipes/${data[item].kepnev}`);
        img.setAttribute('class', 'littleImg');
    }
};

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
