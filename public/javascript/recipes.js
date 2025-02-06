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
        .then((response) => MakeArray(response.receptek))
        .catch((error) => console.log(error));
});

const MakeArray = (data) => {
    const div1 = document.getElementById('div1');
    for (let item of data) {
        const p = document.createElement('p');
        div1.appendChild(p);
        p.innerHTML = item.nev;
    }
    console.log(data);

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
    FillSelect(hozzavalok);
};

const FillSelect = (data) => {
    const select = document.getElementById('hozzavalok');
    for (let item of data) {
        const option = document.createElement('option');
        select.appendChild(option);
        option.innerHTML = item;
    }
    const plusBtn = document.getElementById('addBtn');
    plusBtn.addEventListener('click', () => {
        AddNewForm(data);
    });
};

const AddNewForm = (data) => {
    const innerForms = document.getElementById('innerForms');
    const div = document.createElement('div');
    innerForms.appendChild(div);

    const label = document.createElement('label');
    div.appendChild(label);
    label.for = 'hozzavalok';
    label.innerHTML = 'Hozzávalók:';

    const br = document.createElement('br');
    div.appendChild(br);

    const select = document.createElement('select');
    div.appendChild(select);
    select.name = 'hozzavalok';
    select.id = 'hozzavalok';

    const option0 = document.createElement('option');
    select.appendChild(option0);
    option0.value = 'zero';
    option0.innerHTML = 'Choose!';
    for (let item of data) {
        const option = document.createElement('option');
        select.appendChild(option);
        option.innerHTML = item;
    }

    const button = document.createElement('input');
    div.appendChild(button);
    button.type = 'button';
    button.value = '-';
    button.id = 'removeBtn';
    button.addEventListener('click', () => {
        RemoveForm(div);
    });
};

const RemoveForm = (div) => {
    const innerForms = document.getElementById('innerForms');
    innerForms.removeChild(div);
};
