// const postAPI = (url, postObject) => {
//     return new Promise((resolve, reject) => {
//         fetch(url, {
//             method: 'POST',
//             headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify(postObject)
//         })
//             .then((response) => {
//                 if (!response.ok) {
//                     reject(`Hiba: ${response.statusText} (${response.status})`);
//                 }
//                 return response.json();
//             })
//             .then((data) => resolve(data))
//             .catch((error) => reject(`Hiba: ${error}`));
//     });
// };

// document.addEventListener('DOMContentLoaded', () => {
//     postAPI('/api/feltoltes', {
//         szabi: 'buta'
//     })
//         .then((res) => console.log(res))
//         .catch((err) => console.log(err));
// });
