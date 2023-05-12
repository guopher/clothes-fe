import Clothes from './Clothes'
import {useState, useEffect} from 'react'
import {BASE_URL} from './requests';
import { getBearerToken } from './utilities';
import { POST, json_format } from './constants';

const ClothesList = (props) => {
  const [clothes, setClothes] = useState([])
  const isLoggedIn = props.isLoggedIn

  useEffect(() => {
    if (isLoggedIn) {
      console.log(`isLoggedIn: ${isLoggedIn}`)
      get_items()
    }
  }, [isLoggedIn])

  const get_items = () => {
    if (isLoggedIn) {
      const url = `${BASE_URL}/api/get_items`
      fetch(url, {
        method: POST,
        headers: {
          'Content-Type': json_format,
          'Authorization': `Bearer ${getBearerToken()}`
        },
      })
        .then(response => response.json())
        .then(data => {
          setClothes(data)
        })
        .catch(error => {
          console.log(error)
        })
    }
  }

  // TODO: is there a way to consolidate updateNumWears and updateIsShow
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
      const updatedClothes = [...prevClothes];
      const clothingIndex = updatedClothes.findIndex(c => c._id === item_id);
      // TODO: remove bug where if you delete clothing item, it doesn't actually remove the clothing item. only sets to false
      updatedClothes[clothingIndex] = {
        ...updatedClothes[clothingIndex],
        is_show: updatedIsShow,
      };
      return updatedClothes;
    });
  }

  const clothesList = clothes.length !== 0 ? clothes.filter(item => item.is_show === true).map(item => (
      <Clothes key={item._id} clothes={item} onUpdateNumWears={updateNumWears} onUpdateIsShow={updateIsShow} />
  )) : <h6>Add some more clothes!</h6>

  return clothesList
}

export default ClothesList