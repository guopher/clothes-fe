import './App.css'
import './TopBar.css'
import { GoogleLogin } from '@react-oauth/google';

const TopBar = (props) => {
  const onLogout = props.onLogout
  const isLoggedIn = props.isLoggedIn
  const givenName = props.givenName
  const familyName = props.familyName
  const picture = props.picture
  const onSuccess = props.onSuccess
  const onError = props.onError

  return (
    <div className='top-bar'>
      <h1 className='title'>Project Juicy Mango</h1>
      <GoogleLogin onSuccess={onSuccess} onError={onError} />
      {isLoggedIn && <h6 className='logout' onClick={onLogout}>Logout</h6>}
      {isLoggedIn && picture ? <img className='profile-pic' src={picture} referrerPolicy='no-referrer' /> : null}
    </div>
  )
}

export default TopBar