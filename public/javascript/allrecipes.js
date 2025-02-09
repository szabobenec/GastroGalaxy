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
    const receptDiv = document.getElementById('receptek');
    for (let item of data) {
        const div = document.createElement('div');
        receptDiv.appendChild(div);
        div.setAttribute('class', 'receptDiv grow');

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
            SendRecept(item);
        });

        const h3 = document.createElement('h3');
        titleDiv.appendChild(h3);
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

const SendRecept = async (data) => {
    try {
        const postObject = { recept: data.nev };
        const message = await postAPI('/api/recept', postObject);
        console.log(message);
    } catch (error) {
        console.reject(error);
    }
};
