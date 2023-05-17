import './App.css';
import { GoogleLogin } from '@react-oauth/google';
import {useState, useEffect} from 'react'
import {add_item} from './requests'
import ClothesList from './ClothesList'
import { GET, GET_GOOGLE_USER_INFO, json_format } from './constants';
import {BASE_URL} from './requests';
import { getBearerToken } from './utilities';
import { POST, jwtToken } from './constants';
import AddItem from './AddItem';
import TopBar from './TopBar';
import { JUICY_MANGO } from './strings';

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
  const [error, setError] = useState(false)

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
          setError(false)
          localStorage.setItem('jwtToken', data.token)
          setIsLoggedIn(true)
        })
        .catch(error => {
          setError(true)
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
          if (error instanceof TypeError && error.message && error.message == 'Failed to fetch') {
            console.log('server is down')
            // TODO: this is a server error
          } else {
            console.log('something went wrong')
          }
        })
    } else {
      setIsLoggedIn(false)
    }
  }, [])


  const handleSubmit = (event) => {
    // event.preventDefault()
    if (itemName.length === 0 || companyName.length === 0 || itemName.length === 0) {
      alert('please enter all fields')
    } else {
      add_item(itemName, companyName, priceBought)
      // TODO: this code is needed once we stop refreshing the whole items
      // setItemName('')
      // setCompanyName('')
      // setPriceBought('')
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

  const onError = (error) => {
    console.log(error)
  }

  const onLogout = () => {
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
  }

  const loggedInElement = () => {
      return (
        <div>
          <TopBar 
            onLogout={onLogout}
            isLoggedIn={isLoggedIn}
            givenName={givenName}
            familyName={familyName}
            picture={picture}
            onSuccess={onSuccess}
            onError={onError}
          />
          <div className='overall-view'>
            <AddItem 
              onHandleSubmit={handleSubmit}
              itemName={itemName}
              companyName={companyName}
              priceBought={priceBought}
              onSetItemName={setItemName}
              onSetCompanyName={setCompanyName}
              onSetPriceBought={setPriceBought}
              />
            <div className='clothes-container'>
              <h3>Closet</h3>
              <div>
                <ClothesList error={error} isLoggedIn={isLoggedIn} />
              </div>
            </div>
          </div>
        </div>
      )
  }

  const loggedOutElement = () => {
    return (
      <div className='logged-out-container'>
        <h1 className='title'>{JUICY_MANGO}</h1>
        <GoogleLogin onSuccess={onSuccess} onError={onError} />
      </div>
    )
  }

  return (
    <div className="App">
      <header className="App-header">
        {isLoggedIn ? loggedInElement() : loggedOutElement()}
      </header>
    </div>
  );
}

export default App
