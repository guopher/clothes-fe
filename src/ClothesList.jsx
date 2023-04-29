import Clothes from './Clothes'

const ClothesList = (clothes) => {
  if (clothes !== null && clothes.clothes !== null) {
    const items = clothes.clothes
    const clothesList = items.map(item => (
       <Clothes key={item.item_id} clothes={item} />
    ))
    return clothesList
  } else {
    return null
  }
}

export default ClothesList