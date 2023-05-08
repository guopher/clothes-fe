import './App.css';
import {useState} from 'react'
import {add_item} from './ClothesList'
import ClothesList from './ClothesList'
import Welcome from './Welcome'

const App = () => {
  const [companyName, setCompanyName] = useState("")
  const [priceBought, setPriceBought] = useState("")
  const [itemName, setItemName] = useState("")
  
  const handleSubmit = () => {
    if (itemName === "" || companyName === "" || itemName === "") {
      alert('please enter all fields')
    } else {
      add_item(itemName, companyName, priceBought)
    }
  }

  return (
    <div className="App">
      <header className="App-header">
        <Welcome />
        {/* <h6>Implement deletion of items from the closet!</h6> */}
        <div className='overall-view'>
          <div className='add-item-view'>
            <h3>Add Item</h3>
            <form className='add-item-form' onSubmit={handleSubmit}>
              <label>
                Item Name:
                <input type="text" value={itemName} onChange={(event) => setItemName(event.target.value)} />
              </label>
              <label>
                Company Name:
                <input type="text" value={companyName} onChange={(event) => setCompanyName(event.target.value)} />
              </label>
              <label>
                Purchase Price:
                <input type="text" value={priceBought} onChange={(event) => setPriceBought(event.target.value)} />
              </label>
              <button type="submit">Submit</button>
            </form>
            {/* create error component to display if fields are not met to prevent re-rendering */}
          </div>
          <div className='clothes-list'>
            <h3>Closet</h3>
            <ClothesList companyName={companyName !== "" ? companyName : 'Acme'}/>
          </div>
        </div>
      </header>
    </div>
  );
}

export default App;
