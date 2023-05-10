import Clothes from './Clothes'
import {useState, useEffect} from 'react'
import {BASE_URL} from './requests';

export const add_item = (itemName, companyName, priceBought) => {
  const url = `${BASE_URL}/api/add_item`
  fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
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

const ClothesList = (companyName) => {
  const [clothes, setClothes] = useState([])
  useEffect(() => {
    get_items()
  }, [])

  const get_items = () => {
    const url = `${BASE_URL}/api/get_items`
    fetch(url)
      .then(response => response.json())
      .then(data => {
        setClothes(data)
      })
      .catch(error => {
        console.log(error)
      })
  }


  const updateNumWears = (item_id, updatedNumWears) => {
    setClothes(prevClothes => {
      const updatedClothes = [...prevClothes];
      const clothingIndex = updatedClothes.findIndex(c => c._id === item_id);
      updatedClothes[clothingIndex] = {
        ...updatedClothes[clothingIndex],
        num_wears: updatedNumWears,
      };
      return updatedClothes;
    });
  }

  const updateIsShow = (item_id, updatedIsShow) => {
    setClothes(prevClothes => {
      console.log('entered here')
      const updatedClothes = [...prevClothes];
      const clothingIndex = updatedClothes.findIndex(c => c._id === item_id);
      updatedClothes[clothingIndex] = {
        ...updatedClothes[clothingIndex],
        is_show: updatedIsShow,
      };
      return updatedClothes;
    });
  }

  const clothesList = clothes.length !== 0 ? clothes.filter(item => item.is_show === true).map(item => (
      <Clothes key={item._id} clothes={item} onUpdateNumWears={updateNumWears} onUpdateIsShow={updateIsShow} />
  )) : null

  return clothesList
}

export default ClothesList