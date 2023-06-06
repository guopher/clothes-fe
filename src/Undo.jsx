const Undo = ({ msg, onUndo, closeToast }) => {
  const handleClick = () => {
    onUndo();
    closeToast();
  };

  // TODO: make it so the notification goes away if the user starts doing mouse stuff outside of the notification

  return (
    <div className='btn-undo'>
      <div style={{ fontSize: '20px' }}>
        {msg} <button onClick={handleClick}>UNDO</button>
      </div>
    </div>
  );
};

export default Undo