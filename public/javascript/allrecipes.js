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

document.addEventListener('DOMContentLoaded', () => {
    getAPI('/api/getallrecept')
        .then((response) => MakeCards(response.receptek))
        .catch((error) => console.log(error));
});

const MakeCards = (data) => {
    const receptDiv = document.getElementById('receptek');
    for (let item of data) {
        const div = document.createElement('div');
        receptDiv.appendChild(div);
        div.setAttribute('class', 'receptDiv grow');
        const h3 = document.createElement('h3');
        div.appendChild(h3);
        h3.innerHTML = item.nev;
        const p = document.createElement('p');
        div.appendChild(p);
        p.innerHTML = 'Hozzávalók:<br>';
        p.style.width = '90%';
        for (let item2 of item.hozzavalok) {
            for (let hozzavalo in item2) {
                p.innerHTML += `${hozzavalo}; `;
            }
        }
    }
};
