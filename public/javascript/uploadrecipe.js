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
        document.getElementById('sendBtn').addEventListener('click', () => {
            SendData(data);
        });
    } catch (error) {
        console.error(error);
    }
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
        textBox1.setAttribute('placeholder', 'általános név');

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
        textBox2.setAttribute('placeholder', 'mennyiség; specifikálás');

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
        textArea.setAttribute('placeholder', 'Lépés kifejtése');

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

const SendData = (length) => {
    console.log('send');
    let checker = true;
    const nev = document.getElementById('nev').value;
    const tipus = document.getElementById('tipus').value;
    const ido = document.getElementById('ido').value;
    const adag = document.getElementById('adag').value;
    const kepSrc = document.getElementById('kepSrc');
    console.log(kepSrc);
    const forras = document.getElementById('forras').value;
    if (nev === '' || tipus === '' || ido === '' || adag === '' || kepSrc === '' || forras === '') {
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
    let lepesSzam = 1;
    for (let item of textAreas) {
        if (item.value === '') {
            checker = false;
        }
        lepesek.push(`${lepesSzam}. ${item.value}`);
        lepesSzam++;
    }

    console.log(checker);

    if (checker) {
        let elkeszites = lepesek.join('\n');
        let hozzavalo = [];
        for (let i = 0; i < hozzavalok.length; i++) {
            hozzavalo.push({
                [hozzavalok[i]]: mennyisegek[i]
            });
        }
        let source = kepSrc.value.split('\\')[kepSrc.value.split('\\').length - 1];

        const recept = {
            id: (length + 1) * 1,
            tipus: tipus,
            nev: nev,
            ido: ido * 1,
            adag: adag * 1,
            hozzavalok: hozzavalo,
            elkeszites: elkeszites,
            source: source,
            forras: forras
        };

        SendRecept(recept);
    }
};

const SendRecept = async (recept) => {
    console.log(recept);
    const uploadForm = document.getElementById('uploadForm');

    try {
        // console.log(JSON.stringify(postObject));
        const data = await postAPI('/api/feltoltes', recept);
        console.log(data);

        const formData = new FormData(uploadForm);

        const response = await fetch('/upload', {
            method: 'POST',
            body: formData
        });

        if (response.ok) {
            const data = await response.json();
            alert(data.message);
        } else {
            throw new Error('Upload failed');
        }

        document.location.href = 'uploadrecipe';
    } catch (error) {
        console.error(error);
    }
};
