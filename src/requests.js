export const GET_GOOGLE_USER_INFO = 'https://www.googleapis.com/oauth2/v3/tokeninfo?id_token='
export const BASE_URL = 'http://127.0.0.1:5000'

export const add_wears = (item_id, num_wears) => {
  fetch(`${BASE_URL}/api/add_wears`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
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
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
          item_id: item_id,
      })
    })
      .catch(error => {
        console.log(error)
      })
  }