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

document.addEventListener('DOMContentLoaded', async () => {
    const cards = Array.from(document.getElementsByClassName('cards'));
    for (let item of cards) {
        item.addEventListener('click', () => {
            Link(item);
        });
    }
});

const Link = async (data) => {};
