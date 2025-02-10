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

document.addEventListener('DOMContentLoaded', () => {
    console.log('Welcome to Recipe Uploader!');
    document.getElementById('hozzavaloPlus').addEventListener('click', AddHozzavalo);
    document.getElementById('elkeszitesPlus').addEventListener('click', AddLepes);
});

const AddHozzavalo = () => {
    const hozzavalokDiv = document.getElementById('hozzavalokDiv');
    console.log(hozzavalokDiv);
    const hozzavalok = Array.from(document.getElementsByClassName('hozzavalo'));
    console.log(hozzavalok);
    const innerHozzavaloDivs = Array.from(document.getElementsByClassName('innerHozzavaloDiv'));
    console.log(innerHozzavaloDivs);
    console.log(innerHozzavaloDivs.length);

    if (innerHozzavaloDivs.length < 50) {
        const hozzavaloDiv = document.createElement('div');
        hozzavalokDiv.appendChild(hozzavaloDiv);
        hozzavaloDiv.id = `hozzavalo${innerHozzavaloDivs.length + 1}`;
        hozzavaloDiv.setAttribute('class', 'outerHozzavalo');
        const innerHozzavaloDiv = document.createElement('div');
        hozzavaloDiv.appendChild(innerHozzavaloDiv);
        innerHozzavaloDiv.setAttribute('class', 'hozzavalo');

        const nevSor = document.createElement('div');
        innerHozzavaloDiv.appendChild(nevSor);
        nevSor.setAttribute('class', 'hozzavaloSor');

        const label1 = document.createElement('label');
        nevSor.appendChild(label1);
        label1.setAttribute('for', `hozzavaloNev${innerHozzavaloDivs.length + 1}`);
        label1.innerHTML = 'Hozzávaló neve:';
        const textBox1 = document.createElement('input');
        nevSor.appendChild(textBox1);
        textBox1.type = 'text';
        textBox1.name = `hozzavaloNev${innerHozzavaloDivs.length + 1}`;
        textBox1.id = `hozzavaloNev${innerHozzavaloDivs.length + 1}`;

        // <label for="hozzavaloNev0">Hozzávaló neve:</label>
        // <input type="text" name="hozzavaloNev0" id="hozzavaloNev0" />

        const mennyisegSor = document.createElement('div');
        innerHozzavaloDiv.appendChild(mennyisegSor);
        mennyisegSor.setAttribute('class', 'hozzavaloSor');

        const label2 = document.createElement('label');
        mennyisegSor.appendChild(label2);
        label2.setAttribute('for', `mennyisegNev${innerHozzavaloDivs.length + 1}`);
        label2.innerHTML = 'Mennyisége:';
        const textBox2 = document.createElement('input');
        mennyisegSor.appendChild(textBox2);
        textBox2.type = 'text';
        textBox2.name = `mennyisegNev${innerHozzavaloDivs.length + 1}`;
        textBox2.id = `mennyisegNev${innerHozzavaloDivs.length + 1}`;
    }
};

const AddLepes = () => {
    const elkeszitesDiv = document.getElementById('elkeszitesDiv');
    console.log(elkeszitesDiv);
    const lepesek = Array.from(document.getElementsByClassName('lepes'));
    console.log(lepesek);
};
