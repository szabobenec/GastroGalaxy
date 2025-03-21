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
    console.log('Welcome to Recipe of the Day!');

    // const toggle = document.getElementById('themeChanger');

    // if (localStorage.getItem('theme') === 'dark') {
    //     document.body.setAttribute('data-theme', 'dark');
    //     toggle.checked = true;
    // } else {
    //     document.body.setAttribute('data-theme', 'light');
    //     toggle.checked = false;
    // }

    // console.log(localStorage.getItem('theme'));

    // // Toggle theme when checkbox changes
    // toggle.addEventListener('change', () => {
    //     if (toggle.checked) {
    //         document.body.setAttribute('data-theme', 'dark');
    //         localStorage.setItem('theme', 'dark');
    //     } else {
    //         document.body.setAttribute('data-theme', 'light');
    //         localStorage.setItem('theme', 'light');
    //     }
    // });

    // const themeSwitcher = document.getElementById('themeChanger');
    // const body = document.body;

    // // Check localStorage for saved theme preference
    // const savedTheme = localStorage.getItem('theme');
    // if (savedTheme) {
    //     body.setAttribute('data-theme', savedTheme);
    //     themeSwitcher.checked = savedTheme === 'dark';
    // }

    // // Toggle theme when the checkbox is clicked
    // themeSwitcher.addEventListener('change', () => {
    //     // const theme = themeSwitcher.checked ? 'dark' : 'light';
    //     // body.setAttribute('data-theme', theme);
    //     // localStorage.setItem('theme', theme); // Save theme preference
    //     document.documentElement.setAttribute(
    //         'data-theme',
    //         themeSwitcher.checked ? 'dark' : 'light'
    //     );
    //     // console.log(theme);
    // });

    // document.getElementById('themeChanger').addEventListener('change', function () {
    //     if (this.checked) {
    //         document.body.classList.add('dark-theme');
    //     } else {
    //         document.body.classList.remove('dark-theme');
    //     }
    // });

    document.getElementById('themeChanger').addEventListener('change', function () {
        if (this.checked) {
            // Apply dark theme by adding the class to the body
            document.body.classList.add('dark-theme');
        } else {
            // Remove dark theme when unchecked
            document.body.classList.remove('dark-theme');
        }
    });
});
