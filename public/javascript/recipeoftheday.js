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
            .catch((error) => reject(`Hiba történt: ${error.message}`));
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
    try {
        console.log('Welcome to Recipe of the Day!');
        const data = (await getAPI('/api/recipe-of-the-day')).response;
        RecipeOfTheDay(data[0]);

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
        console.error('Error:', error);

        const hova = document.getElementById('hova');
        const p = document.createElement('p');
        hova.appendChild(p);
        p.setAttribute('class', 'error');
        p.innerHTML = 'Failed to load recipe. Please try again later.';
    }
});

//! Témaváltásért felelő függvény
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

//! Nap receptje adatainak betöltése
const RecipeOfTheDay = (data) => {
    const hova = document.getElementById('hova');
    const cardDiv = document.createElement('div');
    hova.appendChild(cardDiv);
    cardDiv.setAttribute('class', 'recipe-card');

    const img = document.createElement('img');
    cardDiv.appendChild(img);
    img.src = `../images/recipes/${data.kepnev}`;
    img.alt = data.nev;
    img.setAttribute('class', 'recipe-image unselectable');

    const detailsDiv = document.createElement('div');
    cardDiv.appendChild(detailsDiv);
    detailsDiv.setAttribute('class', 'recipe-details');
    const h2 = document.createElement('h2');
    detailsDiv.appendChild(h2);
    h2.innerHTML = data.nev;
    const p1 = document.createElement('p');
    detailsDiv.appendChild(p1);
    p1.innerHTML = `<strong>Típus:</strong> ${data.tipus}`;
    const p2 = document.createElement('p');
    detailsDiv.appendChild(p2);
    p2.innerHTML = `<strong>Elkészítés:</strong> ${data.ido} perc`;
    const p3 = document.createElement('p');
    detailsDiv.appendChild(p3);
    p3.innerHTML = `<strong>Adag:</strong> ${data.adag}`;

    const teljes = document.getElementById('teljes');
    document.getElementById('cardDivBtn').addEventListener('click', () => {
        const input = document.createElement('input');
        teljes.appendChild(input);
        input.type = 'button';
        input.id = 'sendRecipeBtn';
        input.value = 'Teljes recept megtekintése';
        input.setAttribute('class', 'sendRecipeBtn');

        //? Rákattintott recept oldalára való továbbküldés
        input.addEventListener('click', () => {
            document.location.href = `/recipefullview/${data.kepnev.split('.')[0]}`;
        });
    });
};
