import {add_wears, pin_item} from './requests'
import {delete_item} from './requests'
import './Clothes.css';

const Clothes = (props) => {
  const updateNumWears = () => {
    const item = props.clothes
    const item_id = item._id
    add_wears(item_id, item.num_wears + 1)
    props.onUpdateNumWears(item_id, item.num_wears + 1)
    const newNumWears = item.num_wears + 1
    let message = ''
    if (newNumWears >= 10) {
      message = "You've really made use out of this piece! 💪"
    } else if (newNumWears >= 5) {
      message = "Most people don't even wear their clothes more than 5 times 🤩"
    } else if (newNumWears > 2) {
      message = "Yay! Good job ❤️"
    } else if (newNumWears == 1) {
      message = 'Good job on your first wear 👍🏼'
    } else {
      message = 'Keep it up!'
    }
    props.onAddWear(message)
  }

  const item = props.clothes
  const costPerWear = () => {
    if (item.num_wears === 0) {
      return 'Wear this soon!'
    }
    const pricePerWear = (item.price_bought / item.num_wears).toFixed(2)
    const localeString = pricePerWear.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD'
    })
    return `$${pricePerWear}`
  }

  const updateIsShow = () => {
    const item = props.clothes
    const item_id = item._id
    delete_item(item_id)
    props.onUpdateIsShow(item_id, false)
    props.onUndoDelete(itemName, showAgain)
  }

  const itemName = `${item.company} ${item.item_name}`

  const handlePin = () => {
    if (!item.is_pinned || item.is_pinned === undefined) {
      item.is_pinned = true
    } else {
      item.is_pinned = false
    }
    pin_item(item._id, item.is_pinned)
    props.onUpdatePin(item._id, item.is_pinned)
  }

  const showAgain = () => {
    const item = props.clothes
    const item_id = item._id
    delete_item(item_id, true)
    props.onUpdateIsShow(item_id, true)
  }

  return (
    <div className ='clothes'>
      <div className='clothes-info'>
        {/* <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <div onClick={handlePin} className='pin-icon'>🗑️</div>
          <div onClick={handlePin} className='pin-icon'>📌</div>
        </div> */}
        <div onClick={handlePin} className='pin-icon'>📌</div>
        <div className='item-name'>{itemName}</div>
        <p>Cost per wear: {costPerWear()}</p>
        <p className='add-wears' onClick={updateNumWears}>Number of wears: {item.num_wears}</p>
        <p className='delete-item' onClick={updateIsShow} >Delete</p>
      </div>
    </div>
  )
}

export default Clothes