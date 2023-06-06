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
import { JUICY_MANGO, JUICY_MANGO_SUBHEADING, MOBILE_RELEASE } from './strings';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Undo from './Undo';
import ErrorComponent from './ErrorComponent';

const App = () => {
  const [companyName, setCompanyName] = useState("")
  const [priceBought, setPriceBought] = useState("")
  const [itemName, setItemName] = useState("")
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [givenName, setGivenName] = useState(null)
  const [name, setName] = useState(null)
  const [familyName, setFamilyName] = useState(null)
  const [picture, setPicture] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [clothes, setClothes] = useState([])
  const [error, setError] = useState(null)

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
    if (error) {
      console.log(`error changed: ${error}`)
    }
  }, [error])

  const updateAdd = (newItem) => {
    setClothes(prevClothes => {
      const newClothes = [...prevClothes]
      newClothes.unshift(newItem)
      return newClothes
    })
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

  const updateIsPin = (item_id, updatedPin) => {
    setClothes(prevClothes => {
      const updatedClothes = [...prevClothes];
      const clothingIndex = updatedClothes.findIndex(c => c._id === item_id);
      updatedClothes[clothingIndex] = {
        ...updatedClothes[clothingIndex],
        is_pinned: updatedPin,
      };
      return updatedClothes;
    });
  }

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
        .then(response => {
          // setError(false)
          if (response.status === 403) {
            console.log('user forbidden')
            return
          }
          return response.json()
        })
        .then(data => {
          // setError(false)
          setClothes(data)
        })
        .catch(error => {
          console.log(error)
          if (error instanceof TypeError && error.message && error.message === 'Failed to fetch') {
            // TODO: incorporate custom error messages to user?
            setError(true)
          }
        })
    }
  }

  const fetchUser = async () => {
    const url = `${BASE_URL}/api/get_user`

    const timeoutDuration = 2000; // 5 seconds

    // Start the timer
    const timeoutId = setTimeout(() => {
      // Timeout logic
      setIsLoading(false);
      setError(true);
    }, timeoutDuration);

    try {
      const response = await fetch(url, {
        method: GET,
        headers: {
          'Authorization': `Bearer ${getBearerToken()}`
        }
      })
      const data = await response.json()
      clearTimeout(timeoutId)

      if (data.error && data.error == 'Signature has expired') {
        setIsLoggedIn(false)
        setIsLoading(false)
        return
      }

      setFamilyName(data.familyName)
      setGivenName(data.givenName)
      setPicture(data.google_picture_url)
      setIsLoggedIn(true)
      setIsLoading(false)
    } catch(err) {
      console.log('error occured')
      console.log(err)
      setError(true)
      if (err instanceof TypeError && err.message && err.message == 'Failed to fetch') {
        console.log('server is down')
        // TODO: this is a server error
      } else {
        console.log('something went wrong')
      }
      setIsLoggedIn(false)
      console.log(error)
    }
  }

  useEffect(() => {
    setIsLoading(true)
    const token = getBearerToken()
    if (token == null || token == undefined || token == 'undefined') {
      setIsLoggedIn(false)
      setIsLoading(false)
      return
    }

    fetchUser()

    return () => {
      setIsLoading(false)
    }
  }, [])


  const addItem = async (itemName, companyName, priceBought) => {
    const item = await add_item(itemName, companyName, priceBought)
    if (item) {
      const serializedItem = {
        '_id': item._id,
        'item_name': item.item_name,
        'price_bought': item.price_bought,
        'company': item.company,
        'is_show': item.is_show,
        'num_wears': 0,
      }
      updateAdd(serializedItem)
    } else {
      console.log('item was not added')
    }
    setItemName('')
    setCompanyName('')
    setPriceBought('')
    
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    if (itemName.length === 0 || companyName.length === 0 || itemName.length === 0) {
      alert('please enter all fields')
      return
    } 

    if (isNaN(priceBought)) {
      alert('please enter a number for the price')
      return
    }

    addItem(itemName, companyName, priceBought)
  }

  const fetchGoogleUserInfo = async (response) => {
    const credential = response.credential
    const google_url = `${GET_GOOGLE_USER_INFO}${credential}`
    const googleResponse = await fetch(google_url)
    const data = await googleResponse.json()
    setGivenName(data.given_name)
    setFamilyName(data.family_name)
    setPicture(data.picture)
    setName(data.name)
    return {
      sub: data.sub,
      givenName: data.given_name,
      familyName: data.family_name,
      picture: data.picture
    }
  }

  const loginNewUser = async (userInfo) => {
    const url = `${BASE_URL}/api/login`
    try {
      const response = await fetch(url, {
        method: POST,
        headers: {
          'Content-Type': json_format,
        },
        body: JSON.stringify({
          sub: userInfo.sub,
          givenName: userInfo.givenName,
          familyName: userInfo.familyName,
          picture: userInfo.picture,
        })
      })
      const data = await response.json()
      localStorage.setItem('jwtToken', data.token)
      setIsLoggedIn(true)
    } catch (error) {
      setError(true)
      console.log(error)
    }
  }

  const onSuccess = async (response) => {
    try {
      const userInfo = await fetchGoogleUserInfo(response)
      loginNewUser(userInfo)
    } catch (error) {
      console.log(error)
    }
  }

  const onError = (error) => {
    if (error) {
      console.log(error)
    }
    setError(true)
  }

  const logout = () => {
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
      })
      .catch(error => {
        setIsLoading(false)
        console.log(error)
      })
  }

  // TODO: fix this once the number actually updates on deletion. Currently updating on add for some reason
  // const closetTitle = clothes.length > 0 ? `Closet (${clothes.length})` : 'Closet'
  const closetTitle = 'Closet'

  const loggedInElement = () => (
    <div style={{ marginTop: '20px', marginBottom: '20px' }}>
      <ToastContainer autoClose={5000} limit={3} />
      <TopBar 
        onLogout={logout}
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
          <div className='section-header'>Closet</div>
          <div>
            <ClothesList 
              onAddWear={addWearToast} 
              onUndoDelete={undoDelete} 
              isLoggedIn={isLoggedIn} 
              clothes={clothes}
              get_items={get_items}
              updateNumWears={updateNumWears}
              updateIsShow={updateIsShow}
              updateIsPin={updateIsPin}
            />
          </div>
        </div>
      </div>
    </div>
  ) 

  const loggedOutElement = () => {
    return (
      <div className='logged-out-container'>
        <div className='mango-logo-container'>
          <img className='mango-logo' src={require('./img/mango.png')} alt='mango-logo' />
          <div className='logout-title'>{JUICY_MANGO}</div>
        </div>
        <div className='logout-subtitle'>{JUICY_MANGO_SUBHEADING}</div>
        <div className='no-mobile-support'>Mobile interface coming soon!</div>
        <div className='no-mobile-support'>Sign up to get an <a href={MOBILE_RELEASE} target='_blank'>email</a> when it's here</div>
        <div className='google-auth'>
          <GoogleLogin onSuccess={onSuccess} onError={onError} />
        </div>
      </div>
    )
  }

  if (isLoading) {
    return <h1>Loading... (new animation coming soon)</h1>
  }

  if (error) {
    return <ErrorComponent />
  }

  return (
    <div className="App">
      <header className="App-header">
      </header>
       <body>
          {isLoggedIn && !isLoading && !error ? loggedInElement() : loggedOutElement()}
       </body>
    </div>
  );
}

export default App
