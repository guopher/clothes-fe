import './App.css';
import {useState, useEffect} from 'react'
import {add_item} from './requests'
import ClothesList from './ClothesList'
import Welcome from './Welcome'
import { GoogleLogin } from '@react-oauth/google';
import { googleLogout } from '@react-oauth/google';
import { GET, GET_GOOGLE_USER_INFO, json_format } from './constants';
import {BASE_URL} from './requests';
import { getBearerToken } from './utilities';
import { POST, jwtToken } from './constants';

const App = () => {
  const [companyName, setCompanyName] = useState("")
  const [priceBought, setPriceBought] = useState("")
  const [itemName, setItemName] = useState("")
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [givenName, setGivenName] = useState(null)
  const [name, setName] = useState(null)
  const [familyName, setFamilyName] = useState(null)
  const [picture, setPicture] = useState(null)
  const [sub, setSub] = useState(null)

  useEffect(() => {
    if (sub !== null) {
      const url = `${BASE_URL}/api/login`
      fetch(url, {
        method: POST,
        headers: {
          'Content-Type': json_format,
        },
        body: JSON.stringify({
          sub: sub,
          givenName: givenName,
          familyName: familyName,
          picture: picture,
        })
      })
        .then(response => response.json())
        .then(data => {
          localStorage.setItem('jwtToken', data.token)
          setIsLoggedIn(true)
        })
        .catch(error => {
          console.log(error)
        })
    }
  }, [sub])


  useEffect(() => {
    const token = getBearerToken()
    if (token !== null && token !== undefined && token !== 'undefined') {
      setIsLoggedIn(true)
      const url = `${BASE_URL}/api/get_user`
      fetch(url, {
        method: GET,
        headers: {
          'Authorization': `Bearer ${getBearerToken()}`
        }
      })
        .then(response => response.json())
        .then(data => {
          setFamilyName(data.familyName)
          setGivenName(data.givenName)
          setPicture(data.google_picture_url)
        })
        .catch(error => {
          console.log(error)
        })
    } else {
      setIsLoggedIn(false)
    }
  }, [])


  const handleSubmit = () => {
    if (itemName.length === 0 || companyName.length === 0 || itemName.length === 0) {
      alert('please enter all fields')
    } else {
      add_item(itemName, companyName, priceBought, picture)
    }
  }

  const onSuccess = (response) => {
    const credential = response.credential
    const google_url = `${GET_GOOGLE_USER_INFO}${credential}`
    fetch(google_url)
      .then(response => response.json())
      .then(data => {
        setGivenName(data.given_name)
        setFamilyName(data.family_name)
        setPicture(data.picture)
        setName(data.name)
        setSub(data.sub)
      })
      .catch(error => {
        console.log(error)
      })
  }

  // useEffect(() => {
  //   const url = `${BASE_URL}/api/edit_user`
  //   fetch(url, {
  //     method: POST,
  //     headers: {
  //       'Content-Type': json_format,
  //     },
  //     body: JSON.stringify({
  //       sub: sub
  //     })
  //   })
  // }, [givenName, familyName, picutre, name])

  const onError = (error) => {
    console.log(error)
  }

  const onLogout = () => {
    // TODO: put real logout experience
    const url = `${BASE_URL}/api/logout`
    const token = getBearerToken()
    fetch(url, {
      method: POST,
      headers: {
        'Content-Type': json_format,
        'Authorization': `Bearer ${token}`
      },
    })
      .then(response => response.json())
      .then(() => {
        localStorage.removeItem(jwtToken)
        setIsLoggedIn(false)
        setSub(null)
      })
      .catch(error => {
        console.log(error)
      })
    // TODO: figure out what this method does
    googleLogout()
  }

  return (
    <div className="App">
      <header className="App-header">
        <Welcome />
        <GoogleLogin onSuccess={onSuccess} onError={onError} />
        {isLoggedIn && <h6 className='logout' onClick={onLogout}>Logout</h6>}
        {isLoggedIn && familyName !== null ? <h4>{`${givenName} ${familyName}`}</h4> : null}
        {isLoggedIn && picture !== null ? <img src={picture} referrerPolicy='no-referrer' /> : null}
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
            {isLoggedIn && <ClothesList isLoggedIn={isLoggedIn} />}
          </div>
        </div>
      </header>
    </div>
  );
}

export default App
