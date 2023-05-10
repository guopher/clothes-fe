import {add_wears} from './requests'
import {delete_item} from './requests'
import './Clothes.css';

const Clothes = (props) => {
  const updateNumWears = () => {
    const item = props.clothes
    const item_id = item._id
    add_wears(item_id, item.num_wears + 1)
    props.onUpdateNumWears(item_id, item.num_wears + 1)
  }

  const item = props.clothes
  const costPerWear = () => {
    if (item.num_wears === 0) {
      return 'New Item!'
    }
    const pricePerWear = (item.price_bought / item.num_wears).toFixed(2)
    return `$${pricePerWear}`
  }

  const updateIsShow = () => {
    const item = props.clothes
    const item_id = item._id
    delete_item(item_id)
    props.onUpdateIsShow(item_id, false)
  }

  return (
    <div className ='clothes'>
      <p>Item Name: {item.item_name}</p>
      <p>Company: {item.company}</p>
      <p className='add-wears' onClick={updateNumWears}>Number of wears: {item.num_wears}</p>
      <p>Cost Per Wear: {costPerWear()}</p>
      <p className='delete-item' onClick={updateIsShow} >delete</p>
    </div>
  )
}

export default Clothes