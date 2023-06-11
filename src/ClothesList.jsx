import './Clothes.css';
import Clothes from './Clothes'
import {useState, useEffect} from 'react'
import {BASE_URL} from './requests';
import { getBearerToken } from './utilities';
import { POST, json_format } from './constants';
import { alphabeticalSort, reverseAlphabeticalSort, reverseSortCostPerWear, reverseSortNumWears, sortCostPerWear, sortNumWears } from './sortings';

const ALPHABETICAL = 'alphabetical'
const REVERSE_ALPHABETICAL = 'reverseAlphabetical'
const NUM_WEARS = 'numWears'
const REVERSE_NUM_WEARS = 'reverseNumWears'
const COST_PER_WEAR = 'costPerWear'
const REVERSE_COST_PER_WEAR = 'reverseCostPerWear'

const ClothesList = ({ isLoggedIn, onAddWear, onUndoDelete, clothes, get_items, updateNumWears, updateIsShow, updateIsPin }) => {
  const [error, setError] = useState(false)
  const [filterValue, setFilterValue] = useState("")
  const [sort, setSort] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isFilterUnworn, setFilterUnworn] = useState(false)

  useEffect(() => {
    if (isLoggedIn) {
      setIsLoading(true)
      get_items()
      // setIsLoading(false)
    }
    return () => {
      setIsLoading(false)
    }
  }, [isLoggedIn])

  const showClothes = (item) => {
    if (filterValue === "") {
      return item.is_show
    }
    const filterValueLowerCase = filterValue.toLowerCase()
    return item.company.toLowerCase().includes(filterValueLowerCase) || item.item_name.toLowerCase().includes(filterValueLowerCase)
  }

  const getSortFn = () => {
    switch (sort) {
      case ALPHABETICAL:
        return alphabeticalSort;
      case REVERSE_ALPHABETICAL:
        return reverseAlphabeticalSort;
      case REVERSE_NUM_WEARS:
        return reverseSortNumWears;
      case REVERSE_NUM_WEARS:
        return reverseSortNumWears;
      case COST_PER_WEAR:
        return sortCostPerWear;
      case REVERSE_COST_PER_WEAR:
        return reverseSortCostPerWear;
      case NUM_WEARS:
        return sortNumWears;
      default:
        return () => 0;
    }
  }

  const clothesList = () => {
    if (error) {
      return <h5>Server is having some issues 😢</h5>
    } 
    
    const displayedList = getFilteredList().filter(item => !item.is_pinned).map(item => (
        <Clothes key={item._id} 
                  clothes={item} 
                  onUpdateNumWears={updateNumWears} 
                  onUpdateIsShow={updateIsShow} 
                  onUpdatePin={updateIsPin} 
                  onUndoDelete={onUndoDelete}
                  onAddWear={onAddWear}
                  />
    ))

    if (displayedList.length === 0 && filterValue.length > 0) {
      return <h5>Filter too strong</h5>
    }

    return displayedList
  }

  const filterUnworn = (item) => {
    if (isFilterUnworn) {
      return item.num_wears === 0
    }
    return true
  }

  const getFilteredList = () => {
    if (clothes) {
      return clothes
              .filter(showClothes)
              .filter(filterUnworn)
              .sort(getSortFn())
    }
    return []
  }

  const pinnedList = () => {
    const pinned = getFilteredList().filter(item => item.is_pinned).map(item => (
        <Clothes key={item._id} 
                  clothes={item} 
                  onUpdateNumWears={updateNumWears} 
                  onUpdateIsShow={updateIsShow} 
                  onUpdatePin={updateIsPin} 
                  onUndoDelete={onUndoDelete}
                  onAddWear={onAddWear}
                  />
    ))
    return pinned
  }

  const filterOnChange = event => {
    event.preventDefault()
    setFilterValue(event.target.value)
  }

  const handleChange = event => {
    event.preventDefault()
    const sortOption = event.target.value
    if (sortOption === "") {
      setSort(NUM_WEARS)
    } else {
      setSort(event.target.value)
    }
  }

  const renderClothesAvailable = () => (
    <>
      <div className='section-title'>Pinned</div>
      <div className='pinned-list'>
        {pinnedList()}
      </div>
      <div className='section-title'>Others</div>
      <div className='clothes-list'>
        {clothesList()}
      </div>
    </>
  )

  const renderNoClothes = () => (
    <div>
      <img className={'img-closet'}src={require('./img/closet.png')} alt={'Closet'}/>
      <h6>Add your favorite piece of clothing to get started!</h6>
    </div>
  )


  const renderClothesSection = () => {
    return getFilteredList().length === 0  && filterValue === '' && !isFilterUnworn ? renderNoClothes() : renderClothesAvailable()
  }

  const onFilterUnworn = () => {
    setFilterUnworn(!isFilterUnworn)
  }

  const filterStickerClass = isFilterUnworn ? 'filter-unworn-on' : 'filter-unworn-off'

  return (
    <div>
      <div className='filter-items-container'>
        <div>
          <div> 
            <input className='filter-box' type="text" placeholder='Filter' onChange={filterOnChange}/>
          </div>
        </div>
        <div className='filter-sort-container'>
          {clothes && clothes.length > 0 && <div className={filterStickerClass} onClick={onFilterUnworn}>👘 Unworn</div>}
          <select className='filter-select' onChange={handleChange}>
            <option value="">Select sort</option>
            {/* TODO: make this use arrows for up and down so there's less options to pick */}
            <option value={ALPHABETICAL}>A to Z</option>
            <option value={REVERSE_ALPHABETICAL}>Z to A</option>
            <option value={NUM_WEARS}>Highest number of wears to lowest</option>
            <option value={REVERSE_NUM_WEARS}>Lowest number of wears to highest</option>
            <option value={COST_PER_WEAR}>Highest cost per wear to lowest</option>
            <option value={REVERSE_COST_PER_WEAR}>Lowest cost per wear to highest</option>
          </select>
        </div>
      </div>
      {renderClothesSection()} 
    </div>
  )
}

export default ClothesList