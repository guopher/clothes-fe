import { giveFeedback, submitBug } from './ExternalLinks'
import './NavBar.css'

const NavBar = ({ onAddItemTapped, onLogout }) => {
  const onAddItem = () => {
    onAddItemTapped()
  }

  return (
    <div className='navbar'>
      <button className='navbar-btn' onClick={onAddItem}>
        <div className='plus-icon'>+</div>
        <div>Add</div>
      </button>
      <button className='navbar-btn' onClick={giveFeedback}>
        <div>✋</div>
        <div>Feedback?</div>
      </button>
      <button className='navbar-btn' onClick={submitBug}>
        <div>🐛</div>
        <div>Bug?</div>
      </button>
      <button className='navbar-btn' onClick={onLogout}>
        <div>✌️</div>
        <div>Logout</div>
      </button>
    </div>
  )
}

export default NavBar;