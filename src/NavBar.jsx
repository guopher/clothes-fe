import './NavBar.css'

const NavBar = ({ onAddItemTapped }) => {
  const onAddItem = () => {
    onAddItemTapped()
  }

  return (
    <div className='navbar'>
      <button className='navbar-btn' onClick={onAddItem}>+</button>
      <button className='navbar-btn' onClick={() => 'add_item_clicked'}>Home</button>
    </div>
  )
}

export default NavBar;