//! GET metódus
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

//! POST metódus
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
    //? Új hozzávaló- illetve lépésfülek hozzáadásáért felelős gombok
    document.getElementById('hozzavaloPlus').addEventListener('click', AddHozzavalo);
    document.getElementById('elkeszitesPlus').addEventListener('click', AddLepes);
    document.getElementById('tipus').addEventListener('change', function removeFirstOption() {
        const option = document.getElementById('nullOption');
        this.removeChild(option);
        this.removeEventListener('change', removeFirstOption);
    });
    try {
        const data = (await getAPI('/api/getallrecept')).response.length;
        document.getElementById('sendBtn').addEventListener('click', () => {
            SendData(data);
        });

        //? Témaválasztás a NAV-ban lévő SVG segítségével
        const themeChanger = document.getElementById('themeChanger');
        const theme = (await getAPI('/api/gettheme')).theme;
        if (theme) {
            document.body.classList.add('dark-theme');
            themeChanger.setAttribute('checked', true);
        } else {
            document.body.classList.remove('dark-theme');
            themeChanger.removeAttribute('checked');
        }

        themeChanger.addEventListener('change', () => {
            changeTheme(themeChanger);
        });
    } catch (error) {
        console.error(error);
    }
});

//! Témaváltáshoz használt függvény
const changeTheme = async (theme) => {
    let saveTheme;
    if (theme.checked) {
        document.body.classList.add('dark-theme');
        saveTheme = true;
    } else {
        document.body.classList.remove('dark-theme');
        saveTheme = false;
    }

    const postObject = { theme: saveTheme };

    try {
        const data = await postAPI('/api/savetheme', postObject);
        console.log(data);
    } catch (error) {
        console.error(error);
    }
};

//! Új hozzávalófül hozzáadása
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

//! Hozzávalófül visszavonása
const RemoveHozzavalo = (div) => {
    div.removeChild(div.lastChild);
};

//! Új lépésfül hozzáadása
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

//! Lépésfül visszavonása
const RemoveLepes = (div) => {
    div.removeChild(div.lastChild);
};

//! Összes adat egy PosObject-be való mentése, amit aztán továbbküld a BackEnd számára
const SendData = (length) => {
    //? Adatok lekérése
    let checker = true;
    const nev = document.getElementById('nev').value;
    const tipus = document.getElementById('tipus').value;
    const ido = document.getElementById('ido').value;
    const adag = document.getElementById('adag').value;
    const tagek = document.getElementById('tagek').value;
    const kepSrc = document.getElementById('kepSrc');
    const forras = document.getElementById('forras').value;
    if (
        nev === '' ||
        tipus === 'null' ||
        ido === '' ||
        adag === '' ||
        kepSrc === '' ||
        forras === ''
    ) {
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

    //? Adatok ürességének ellenőrzése
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
            tagek: tagek,
            ido: ido * 1,
            adag: adag * 1,
            hozzavalok: hozzavalo,
            elkeszites: elkeszites,
            kepnev: source,
            forras: forras
        };

        SendRecept(recept);
    } else {
        //? Üres adatok esetén megjelenő SweetAlert
        Swal.fire({
            title: 'Sikertelen feltöltés!',
            text: 'Üres mező(k)!',
            icon: 'error'
        });
    }
};

//! Recept adatainak feltöltése
const SendRecept = async (recept) => {
    try {
        //? Adatok feltöltése
        const data = await postAPI('/api/feltoltes', recept);
        console.log(data);

        if (data.message !== 'Hiba') {
            await Swal.fire({
                title: 'Sikeres feltöltés!',
                text: `Recept sikeresen feltöltve! (${data.message})`,
                icon: 'success'
            });

            document.location.href = `/recipefullview/${recept.kepnev}`;
        } else {
            //? Hibás adatok esetén megjelenő SweetAlert
            Swal.fire({
                title: 'Sikertelen feltöltés!',
                text: `Hibás adatok! (${data.message})`,
                icon: 'error'
            });
        }
    } catch (error) {
        console.error(error);
    }
};
