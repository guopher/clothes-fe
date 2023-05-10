import './App.css';
import {useState, useEffect} from 'react'
import {add_item} from './ClothesList'
import ClothesList from './ClothesList'
import Welcome from './Welcome'
import { GoogleLogin } from '@react-oauth/google';
import { googleLogout } from '@react-oauth/google';
import { GET_GOOGLE_USER_INFO } from './requests';
import {BASE_URL} from './requests';

const App = () => {
  const [companyName, setCompanyName] = useState("")
  const [priceBought, setPriceBought] = useState("")
  const [itemName, setItemName] = useState("")
  const [token, setToken] = useState("")
  const [givenName, setGivenName] = useState("")
  const [name, setName] = useState("")
  const [familyName, setFamilyName] = useState("")
  const [picture, setPicture] = useState("")
  const [isLoggingIn, setIsLoggingIn] = useState(false)

  useEffect(() => {
    // TODO:
    // store user information in the DB so we don't have to call Google everytime
    // if there is a change in information when we sign in/sign out, then we should update this info in DB
    if (token.length > 0) {
      const url = `${GET_GOOGLE_USER_INFO}${token}`
      fetch(url)
        .then(response => response.json())
        .then(data => {
          setGivenName(data.given_name)
          setFamilyName(data.family_name)
          setPicture(data.picture)
          setName(data.name)
          setIsLoggingIn(true)
        })
        .catch(error => {
          console.log(error)
        })
    }
  }, [token])

  useEffect(() => {
    if (isLoggingIn) {
      const url = `${BASE_URL}/api/edit_user`
      fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token: token,
          givenName: givenName,
          familyName: familyName,
          picture: picture,
        })
      })
        .then(response => response.json())
        .then(data => {
          setIsLoggingIn(false)
        })
        .catch(error => {
          console.log(error)
          setIsLoggingIn(false)
        })
    }
  }, [isLoggingIn])

  const handleSubmit = () => {
    if (itemName === "" || companyName === "" || itemName === "") {
      alert('please enter all fields')
    } else {
      add_item(itemName, companyName, priceBought)
    }
  }

  const onSuccess = (response) => {
    const url = `${BASE_URL}/api/login`
    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        oauth_token: response.credential,
      })
    })
      .then(response => response.json())
      .then(data => {
        setToken(response.credential)
      })
      .catch(error => {
        console.log(error)
      })
  }

  const onError = (error) => {
    console.log(error)
  }

  const onLogout = () => {
    // TODO: put real logout experience
    googleLogout()
  }

  return (
    <div className="App">
      <header className="App-header">
        <Welcome />
        <GoogleLogin onSuccess={onSuccess} onError={onError} />
        <h6 onClick={onLogout}>Logout</h6>
        {name.length > 0 ? <h6>{name}</h6> : null}
        {picture.length > 0 ? <img src={picture} referrerPolicy='no-referrer' /> : null}
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

export default App
