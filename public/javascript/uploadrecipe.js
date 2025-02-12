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
    console.log('Welcome to Recipe Uploader!');
    document.getElementById('hozzavaloPlus').addEventListener('click', AddHozzavalo);
    document.getElementById('elkeszitesPlus').addEventListener('click', AddLepes);
    try {
        const data = (await getAPI('/api/getallrecept')).receptek.length;
        console.log(data);
    } catch (error) {
        console.error(error);
    }
    document.getElementById('sendBtn').addEventListener('click', SendData);
});

const AddHozzavalo = () => {
    const hozzavalokDiv = document.getElementById('hozzavalokDiv');
    const hozzavalok = Array.from(document.getElementsByClassName('hozzavalo'));

    if (hozzavalok.length < 50) {
        const hozzavaloDiv = document.createElement('div');
        hozzavalokDiv.appendChild(hozzavaloDiv);
        hozzavaloDiv.id = `hozzavalo${hozzavalok.length}`;
        hozzavaloDiv.setAttribute('class', 'outerHozzavalo');
        const innerHozzavaloDiv = document.createElement('div');
        hozzavaloDiv.appendChild(innerHozzavaloDiv);
        innerHozzavaloDiv.setAttribute('class', 'hozzavalo');

        const nevSor = document.createElement('div');
        innerHozzavaloDiv.appendChild(nevSor);
        nevSor.setAttribute('class', 'hozzavaloSor');

        const label1 = document.createElement('label');
        nevSor.appendChild(label1);
        label1.setAttribute('for', `hozzavaloNev${hozzavalok.length}`);
        label1.innerHTML = 'Hozzávaló neve:';
        const textBox1 = document.createElement('input');
        nevSor.appendChild(textBox1);
        textBox1.type = 'text';
        textBox1.name = `hozzavaloNev${hozzavalok.length}`;
        textBox1.id = `hozzavaloNev${hozzavalok.length}`;
        textBox1.setAttribute('class', 'hozzavaloNev');

        const mennyisegSor = document.createElement('div');
        innerHozzavaloDiv.appendChild(mennyisegSor);
        mennyisegSor.setAttribute('class', 'hozzavaloSor');

        const label2 = document.createElement('label');
        mennyisegSor.appendChild(label2);
        label2.setAttribute('for', `mennyisegNev${hozzavalok.length}`);
        label2.innerHTML = 'Mennyisége:';
        const textBox2 = document.createElement('input');
        mennyisegSor.appendChild(textBox2);
        textBox2.type = 'text';
        textBox2.name = `mennyisegNev${hozzavalok.length}`;
        textBox2.id = `mennyisegNev${hozzavalok.length}`;
        textBox2.setAttribute('class', 'hozzavaloMennyiseg');

        const btnDiv = document.createElement('div');
        hozzavaloDiv.appendChild(btnDiv);
        btnDiv.setAttribute('class', 'btnDiv');
        const btn = document.createElement('input');
        btnDiv.appendChild(btn);
        btn.type = 'button';
        btn.id = `minus${hozzavalok.length}`;
        btn.value = '-';
        btn.addEventListener('click', () => {
            RemoveHozzavalo(hozzavalokDiv);
        });
    }
};

const RemoveHozzavalo = (div) => {
    div.removeChild(div.lastChild);
};

const AddLepes = () => {
    const elkeszitesDiv = document.getElementById('elkeszitesDiv');
    const lepesek = Array.from(document.getElementsByClassName('lepes'));

    if (lepesek.length < 10) {
        const lepesDiv = document.createElement('div');
        elkeszitesDiv.appendChild(lepesDiv);
        lepesDiv.id = `elkeszites${lepesek.length}`;
        lepesDiv.setAttribute('class', 'outerLepes');
        const innerLepesDiv = document.createElement('div');
        lepesDiv.appendChild(innerLepesDiv);
        innerLepesDiv.setAttribute('class', 'lepes');

        const lepesSor = document.createElement('div');
        innerLepesDiv.appendChild(lepesSor);
        lepesSor.setAttribute('class', 'lepesSor');

        const label = document.createElement('label');
        lepesSor.appendChild(label);
        label.setAttribute('for', `lepes${lepesek.length}`);
        label.innerHTML = `${lepesek.length + 1}. lépés:`;
        const textArea = document.createElement('textarea');
        lepesSor.appendChild(textArea);
        textArea.name = `lepes${lepesek.length}`;
        textArea.id = `lepes${lepesek.length}`;
        textArea.setAttribute('class', 'textAreas');

        const btnDiv = document.createElement('div');
        lepesDiv.appendChild(btnDiv);
        btnDiv.setAttribute('class', 'btnDiv');
        const btn = document.createElement('input');
        btnDiv.appendChild(btn);
        btn.type = 'button';
        btn.id = `minus${lepesek.length}`;
        btn.value = '-';

        btn.addEventListener('click', () => {
            RemoveLepes(elkeszitesDiv);
        });
    }
};

const RemoveLepes = (div) => {
    div.removeChild(div.lastChild);
};

const SendData = () => {
    console.log('send');
    let checker = true;
    const nev = document.getElementById('nev').value;
    const tipus = document.getElementById('tipus').value;
    const ido = document.getElementById('ido').value;
    const adag = document.getElementById('adag').value;
    if (nev === '' || tipus === '' || ido === '' || adag === '') {
        checker = false;
    }

    const hozzavaloNev = Array.from(document.getElementsByClassName('hozzavaloNev'));
    let hozzavalok = [];
    for (let item of hozzavaloNev) {
        if (item.value === '') {
            checker = false;
        }
        hozzavalok.push(item.value);
    }
    const hozzavaloMennyiseg = Array.from(document.getElementsByClassName('hozzavaloMennyiseg'));
    let mennyisegek = [];
    for (let item of hozzavaloMennyiseg) {
        if (item.value === '') {
            checker = false;
        }
        mennyisegek.push(item.value);
    }

    const textAreas = Array.from(document.getElementsByClassName('textAreas'));
    let lepesek = [];
    for (let item of textAreas) {
        if (item.value === '') {
            checker = false;
        }
        lepesek.push(item.value);
    }

    console.log(checker);

    if (checker) {
        const recept = {};
    }

    console.log(nev, tipus, ido, adag, hozzavalok, mennyisegek, lepesek);
};
