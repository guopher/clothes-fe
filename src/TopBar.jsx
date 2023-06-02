import './App.css'
import './TopBar.css'
import { GoogleLogin } from '@react-oauth/google';
import { BUG_FORM, FEEDBACK_FORM, JUICY_MANGO } from './strings';

const TopBar = (props) => {
  const onLogout = props.onLogout
  const isLoggedIn = props.isLoggedIn
  const givenName = props.givenName
  const familyName = props.familyName
  const picture = props.picture
  const onSuccess = props.onSuccess
  const onError = props.onError

  console.log(`TopBar isLoading: ${props.isLoading}`)

  const giveFeedback = () => {
    window.open(FEEDBACK_FORM, '_blank')
  }

  const submitBug = () => {
    window.open(BUG_FORM, '_blank')
  }

  return (
    <div className='top-bar'>
      <h1 className='title'>{JUICY_MANGO}</h1>
      {!isLoggedIn && <GoogleLogin onSuccess={onSuccess} onError={onError} />}
      {isLoggedIn && <h6 className='logout' onClick={onLogout}>Logout</h6>}
      <h6 className='feedback' onClick={giveFeedback} >Feedback?</h6>
      <h6 className='btn-bug' onClick={submitBug} >Bug?</h6>
      {isLoggedIn && picture ? <img className='profile-pic' src={picture} referrerPolicy='no-referrer' /> : null}
    </div>
  )
}

export default TopBar