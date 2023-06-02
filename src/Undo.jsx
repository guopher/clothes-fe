const Undo = ({ msg, onUndo, closeToast }) => {
  const handleClick = () => {
    onUndo();
    closeToast();
  };

  // TODO: make it so the notification goes away if the user starts doing mouse stuff outside of the notification

  return (
    <div className='btn-undo'>
      <p>
        {msg} <button onClick={handleClick}>UNDO</button>
      </p>
    </div>
  );
};

export default Undo