import './App.css'

const AddItem = (props) => {
  const handleSubmit = props.onHandleSubmit
  const setItemName = props.onSetItemName
  const setCompanyName = props.onSetCompanyName
  const setPriceBought = props.onSetPriceBought
  
  const itemName = props.itemName
  const companyName = props.companyName
  const priceBought = props.priceBought

  const isSubmitEnabled = () => {
    return props.itemName !== '' && props.companyName !== '' && props.priceBought !== ''
  }

  return (
    <div className='add-item-container'>
      <h3>Add Item</h3>
      <div className='add-item-view'>
        <form className='add-item-form' onSubmit={handleSubmit}>
          <div className='form-group'>
            <div className='label-container'>
              <label>
                Company Name
              <div className='input-container'>
                <input type="text" placeholder={'Cotopaxi'} value={companyName} onChange={(event) => setCompanyName(event.target.value)} />
              </div>
              </label>
            </div>
          </div>
          <div className='form-group'>
            <div className='label-container'>
              <label>
                Item Name
              </label>
            </div>
            <div className='input-container'>
              <input type="text" placeholder={'Rain jacket'} value={itemName} onChange={(event) => setItemName(event.target.value)} />
            </div>
          </div>
          <div className='form-group'>
            <div className='label-container'>
              <label>
                Purchase Price
              <div className='input-container'>
                <input placeholder={100} type="text" value={priceBought} onChange={(event) => setPriceBought(event.target.value)} />
              </div>
              </label>
            </div>
          </div>
          <button className={isSubmitEnabled() ? 'add-item-submit' : 'add-item-submit-disabled'} type="submit" disabled={!isSubmitEnabled()} >Submit</button>
        </form>
        {/* create error component to display if fields are not met to prevent re-rendering */}
      </div>
    </div>
  )
}

export default AddItem