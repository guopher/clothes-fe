import './App.css';
import {useState} from 'react'
import {add_wears} from './requests'
import {BASE_URL} from './requests';
import ClothesList from './ClothesList'
import Welcome from './Welcome'

const App = () => {
  const [companyName, setCompanyName] = useState("")
  const [inputValue, setInputValue] = useState("")
  const [clothes, setClothes] = useState([])
  
  const changeCompanyName = () => {
    setCompanyName(inputValue)
    setInputValue("")
  }

  const handleChange = (event) => {
    setInputValue(event.target.value)
  }

  const add_item = () => {
    const url = `${BASE_URL}/api/add_item`
    console.log(`url: ${url}`)
    const name = companyName.length > 0 ? companyName : "Acme"
    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
          item_name: 'vest',
          price_bought: 90,
          company: name,
      })
    })
      .then(response => response.json())
      .then(data => console.log(data))
      .catch(error => {
        console.log(error)
      })
  }

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


  return (
    <div className="App">
      <header className="App-header">
        <Welcome />
        <input type="text" value={inputValue} onChange={handleChange} />
        <button onClick={changeCompanyName}>Enter</button>
        {clothes.length > 0 && <ClothesList clothes={clothes}/>}
        <h2 onClick={get_items}>Get Items</h2>
        <h2 onClick={add_wears}>Add Wears</h2>
        <h2 onClick={add_item}>Add Item</h2>
      </header>
    </div>
  );
}

export default App;
