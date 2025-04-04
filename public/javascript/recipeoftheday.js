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

        //! Nap receptje adatainak betöltése
        console.log('kártyaadatok feltöltése');
        const apiData = await getAPI('/api/recipe-of-the-day');

        // Extract ONLY the fields you need from the first recipe
        const { tipus, nev, ido, adag, kepnev } = apiData.response[0];

        // Create a clean object with selected fields
        const recipeData = { tipus, nev, ido, adag, kepnev };
        console.log('Extracted data:', recipeData);

        // Render to HTML
        let link = kepnev.split('.');
        const teljes = document.getElementById('teljes');
        const hova = document.getElementById('hova');
        hova.innerHTML = `
            <div class="recipe-card">
                <img src="../images/recipes/${kepnev}" alt="${nev}" class="recipe-image">
                <div class="recipe-details">
                    <h2>${nev}</h2>
                    <p><strong>Típus:</strong> ${tipus}</p>
                    <p><strong>Elkészítés:</strong> ${ido} perc</p>
                    <p><strong>Adag:</strong> ${adag}</p>
                </div>
            </div>
        `;
        console.log(apiData);

        document.getElementById('cardDivBtn').addEventListener('click', () => {
            teljes.innerHTML = `<input type="button" class="sendRecipeBtn" id="sendRecipeBtn" value="Teljes recept megtekintése" />`;

            //? Rákattintott recept oldalára való továbbküldés
            document.getElementById('sendRecipeBtn').addEventListener('click', () => {
                document.location.href = `/recipefullview/${
                    apiData.response[0].kepnev.split('.')[0]
                }`;
            });
        });
    } catch (error) {
        console.error('Error:', error);
        document.getElementById('hova').innerHTML = `
            <p class="error">Failed to load recipe. Please try again later.</p>
        `;
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
