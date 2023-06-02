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
import { JUICY_MANGO, JUICY_MANGO_SUBHEADING } from './strings';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Undo from './Undo';

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
  const [isLoading, setIsLoading] = useState(false)


  const undoComponent = (itemName, onClickConfirm) => (
    <Undo msg={`${itemName} deleted`} 
          onUndo={onClickConfirm ? onClickConfirm : () => console.log('notification clicked')} />
  )

  const undoDelete = (itemName, onClickConfirm) => toast(undoComponent(itemName, onClickConfirm), {
    theme: "dark"
  })

  const addWearToast = (message) => toast.success(message, {
    theme: "dark"
  })

  useEffect(() => {
    setIsLoading(true)
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
          setIsLoading(false)
          setError(false)
          localStorage.setItem('jwtToken', data.token)
          setIsLoggedIn(true)
        })
        .catch(error => {
          setIsLoading(false)
          setError(true)
          console.log(error)
          console.log(error.code)
        })
    }
  }, [sub])


  useEffect(() => {
    setIsLoading(true)
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
          setIsLoading(false)
          if (data.error && data.error == 'Signature has expired') {
            setIsLoggedIn(false);
            return;
          }
          setFamilyName(data.familyName)
          setGivenName(data.givenName)
          setPicture(data.google_picture_url)
        })
        .catch(error => {
          setIsLoading(false)
          console.log('error occured')
          console.log(error)
          console.log(error.code)
          if (error instanceof TypeError && error.message && error.message == 'Failed to fetch') {
            console.log('server is down')
            // TODO: this is a server error
          } else {
            console.log('something went wrong')
          }
        })
    } else {
      setIsLoading(false)
      setIsLoggedIn(false)
    }
  }, [])


  const handleSubmit = (event) => {
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

  const onLogout = () => {
    setIsLoading(false)
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
        setIsLoading(false)
        localStorage.removeItem(jwtToken)
        setIsLoggedIn(false)
        setSub(null)
        console.log(`isLoading: ${isLoading}`)
      })
      .catch(error => {
        setIsLoading(false)
        console.log(error)
      })
  }

  const loggedInElement = () => (
    <>
      <ToastContainer autoClose={5000} />
      <TopBar 
        onLogout={onLogout}
        isLoggedIn={isLoggedIn}
        givenName={givenName}
        familyName={familyName}
        picture={picture}
        onSuccess={onSuccess}
        onError={(error) => console.log(error)}
        isLoading={isLoading}
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
            <ClothesList 
              isLoading={isLoading} 
              onAddWear={addWearToast} 
              onUndoDelete={undoDelete} 
              error={() => console.log(error)} 
              isLoggedIn={isLoggedIn} 
            />
          </div>
        </div>
      </div>
    </>
  ) 

  const loggedOutElement = () => {
    return (
      <div className='logged-out-container'>
        <h1>{JUICY_MANGO}</h1>
        <h5>{JUICY_MANGO_SUBHEADING}</h5>
        <GoogleLogin onSuccess={onSuccess} onError={(error) => console.log(error)} />
      </div>
    )
  }

  console.log(`render isLoading: ${isLoading}`)
  if (isLoading) {
    return (
      <div>Loading...</div>
    )
  }

  return (
    <div className="App">
      <header className="App-header">
      </header>
       <body>
          {isLoggedIn ? loggedInElement() : loggedOutElement()}
       </body>
    </div>
  );
}

export default App
