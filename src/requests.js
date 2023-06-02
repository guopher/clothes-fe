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

export const pin_item = (item_id, isPinned) => {
  const url = `${BASE_URL}/api/pin_item`
  const bearer = getBearerToken()
  console.log(`bearer: ${bearer}}`)
  fetch(url, {
    method: POST,
    headers: {
      'Content-Type': json_format,
      'Authorization': `Bearer: ${getBearerToken()}`
    },
    body: JSON.stringify({
        item_id: item_id,
        is_pinned: isPinned,
    })
  })
    .catch(error => {
      console.log(error)
    })
}

export const delete_item = (item_id, is_show) => {
  const url = `${BASE_URL}/api/delete_item`
  const body = { item_id: item_id }
  if (is_show) {
    body.is_show = is_show
  }
  fetch(url, {
    method: POST,
    headers: {
      'Content-Type': json_format,
    },
    body: JSON.stringify(body)
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
    .catch(error => {
      console.log(error)
    })
}

