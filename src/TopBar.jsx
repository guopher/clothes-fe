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

  // console.log(`TopBar isLoading: ${props.isLoading}`)

  const giveFeedback = () => {
    window.open(FEEDBACK_FORM, '_blank')
  }

  const submitBug = () => {
    window.open(BUG_FORM, '_blank')
  }

  const onTitleClick = () => {
    alert('sorry, this button will have functionality coming soon! 😊')
  }

  return (
    <div className='top-bar'>
      {/* <div style={{ display: 'flex'}}>
        <div className='title' onClick={}>{JUICY_MANGO}</div>
      </div> */}
      <div className='mango-logo-topbar-container '>
        <img className='mango-logo' src={require('./img/mango.png')} alt='mango-logo' />
        <div className='title'>{JUICY_MANGO}</div>
      </div>
      <div style={{ display: 'flex'}}>
        {!isLoggedIn && <GoogleLogin onSuccess={onSuccess} onError={onError} />}
        <h6 className='feedback' onClick={giveFeedback} >Feedback?</h6>
        <h6 className='btn-bug' onClick={submitBug} >Bug?</h6>
        {isLoggedIn && <h6 className='logout' onClick={onLogout}>Logout</h6>}
        {isLoggedIn && picture ? <img className='profile-pic' src={picture} referrerPolicy='no-referrer' /> : null}
      </div>
    </div>
  )
}

export default TopBar