import { POST, json_format } from './constants';
import { getBearerToken } from './utilities';

export const BASE_URL = 'http://127.0.0.1:5000'

export const add_wears = (item_id, num_wears) => {
  const url = `${BASE_URL}/api/add_wears`;
  fetch(url, {
    method: POST,
    headers: {
      'Content-Type': json_format,
    },
    body: JSON.stringify({
        item_id: item_id,
        new_num_wears: num_wears,
    })
  })
    .catch(error => {
      console.log(error)
    })
}

  export const delete_item = (item_id) => {
    const url = `${BASE_URL}/api/delete_item`
    fetch(url, {
      method: POST,
      headers: {
        'Content-Type': json_format,
      },
      body: JSON.stringify({
          item_id: item_id,
      })
    })
      .catch(error => {
        console.log(error)
      })
  }

export const add_item = (itemName, companyName, priceBought) => {
  const url = `${BASE_URL}/api/add_item`
  const bearer = getBearerToken()
  console.log(`bearer: ${bearer}}`)
  fetch(url, {
    method: POST,
    headers: {
      'Content-Type': json_format,
      'Authorization': `Bearer: ${getBearerToken()}`
    },
    body: JSON.stringify({
        item_name: itemName,
        price_bought: priceBought,
        company: companyName,
    })
  })
    // .then(response => response.json())
    // .then(data => {
      
    // })
    .catch(error => {
      console.log(error)
    })
}

// export const pin_item = (item_id, isPin) => {
//   const url = `${BASE_URL}/api/pin_item`
//   const bearer = getBearerToken()
//   console.log(`bearer: ${bearer}}`)
//   fetch(url, {
//     method: POST,
//     headers: {
//       'Content-Type': json_format,
//       'Authorization': `Bearer: ${getBearerToken()}`
//     },
//     body: JSON.stringify({
//         item_name: itemName,
//         price_bought: priceBought,
//         company: companyName,
//     })
//   })
//     // .then(response => response.json())
//     // .then(data => {
      
//     // })
//     .catch(error => {
//       console.log(error)
//     })
// }
