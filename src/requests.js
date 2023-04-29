export const BASE_URL = 'http://127.0.0.1:5000'

export function add_wears() {
  fetch(`${BASE_URL}/api/add_wears`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        item_id: 2,
    })
  })
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(error => {
      console.log(error)
    })
}

// export function add_item() {
//   fetch(`${BASE_URL}/api/add_item`, {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json'
//     },
//     body: JSON.stringify({
//         item_name: 'vest',
//         price_bought: 90,
//         company: 'Patagonia',
//     })
//   })
//     .then(response => response.json())
//     .then(data => console.log(data))
//     .catch(error => {
//       console.log(error)
//     })
// }