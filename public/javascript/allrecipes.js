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

document.addEventListener('DOMContentLoaded', () => {
    getAPI('/api/getallrecept')
        .then((response) => MakeCards(response.receptek))
        .catch((error) => console.log(error));
});

const MakeCards = (data) => {
    const receptDiv = document.getElementById('innerReceptek');
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
        // const p = document.createElement('p');
        // div.appendChild(p);
        // p.innerHTML = 'Hozzávalók:<br>';
        // p.style.width = '90%';
        // for (let item2 of item.hozzavalok) {
        //     for (let hozzavalo in item2) {
        //         p.innerHTML += `${hozzavalo}; `;
        //     }
        // }

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
        document.location.href = 'recipefullview';
    } catch (error) {
        console.error(error);
    }
};
