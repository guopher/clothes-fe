const Clothes = (clothes) => {
  const item = clothes.clothes
  return (
    <div>
      <p>Company: {item.company}</p>
      <p>Item_Name: {item.item_name}</p>
      <p>Number of wears: {item.num_wears}</p>
    </div>
  )
}

export default Clothes