export const BASE_URL = 'http://127.0.0.1:5000'

export const add_wears = (item_id) => {
  fetch(`${BASE_URL}/api/add_wears`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        item_id: item_id,
    })
  })
    // .then(response => response.json())
    // .then(data => console.log(data))
    .catch(error => {
      console.log(error)
    })
}

  export const delete_item = (item_id) => {
    // const item = props.clothes
    // const item_id = item.item_id  
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
      // .then(response => response.json())
      // .then(data => {
      //   console.log(data)
      //   props.onUpdateIsShow(item_id, false)
      // })
      .catch(error => {
        console.log(error)
      })
  }