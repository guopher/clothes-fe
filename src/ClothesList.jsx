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

const ClothesList = (props) => {
  const [clothes, setClothes] = useState([])
  const [error, setError] = useState(false)
  const isLoggedIn = props.isLoggedIn
  const [filterValue, setFilterValue] = useState("")
  const [sort, setSort] = useState("")

  useEffect(() => {
    if (isLoggedIn) {
      get_items()
    }
  }, [isLoggedIn])

  const get_items = () => {
    if (isLoggedIn) {
      const url = `${BASE_URL}/api/get_items`
      fetch(url, {
        method: POST,
        headers: {
          'Content-Type': json_format,
          'Authorization': `Bearer ${getBearerToken()}`
        },
      })
        .then(response => {
          if (response.status === 403) {
            console.log('user forbidden')
            return
          }
          // setError(false)
          return response.json()
        })
        .then(data => {
          setError(false)
          setClothes(data)
        })
        .catch(error => {
          console.log(error)
          if (error instanceof TypeError && error.message && error.message === 'Failed to fetch') {
            // TODO: incorporate custom error messages to user?
            setError(true)
          }
        })
    }
  }

  // TODO: is there a way to consolidate updateNumWears and updateIsShow
  const updateNumWears = (item_id, updatedNumWears) => {
    setClothes(prevClothes => {
      const updatedClothes = [...prevClothes];
      const clothingIndex = updatedClothes.findIndex(c => c._id === item_id);
      updatedClothes[clothingIndex] = {
        ...updatedClothes[clothingIndex],
        num_wears: updatedNumWears,
      };
      return updatedClothes;
    });
  }

  const updateIsShow = (item_id, updatedIsShow) => {
    setClothes(prevClothes => {
      const updatedClothes = [...prevClothes];
      const clothingIndex = updatedClothes.findIndex(c => c._id === item_id);
      // TODO: remove bug where if you delete clothing item, it doesn't actually remove the clothing item. only sets to false
      updatedClothes[clothingIndex] = {
        ...updatedClothes[clothingIndex],
        is_show: updatedIsShow,
      };
      return updatedClothes;
    });
  }

  const updatePin = (item_id, updatedPin) => {
    setClothes(prevClothes => {
      const updatedClothes = [...prevClothes];
      const clothingIndex = updatedClothes.findIndex(c => c._id === item_id);
      updatedClothes[clothingIndex] = {
        ...updatedClothes[clothingIndex],
        is_pinned: updatedPin,
      };
      return updatedClothes;
    });
  }

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
                  onUpdatePin={updatePin} 
                  onUndoDelete={props.onUndoDelete}
                  onAddWear={props.onAddWear}
                  />
    ))

    if (displayedList.length === 0 && filterValue.length > 0) {
      return <h5>Filter too strong 😪</h5>
    }

    return displayedList
  }

  const getFilteredList = () => {
    if (clothes) {
      return clothes
              .filter(showClothes)
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
                  onUpdatePin={updatePin} 
                  onUndoDelete={props.onUndoDelete}
                  onAddWear={props.onAddWear}
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

  const numTotalClothes = getFilteredList().filter(item => !item.is_pinned).length + 
                          getFilteredList().filter(item => item.is_pinned).length

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
      <img className={'img-closet'}src={require('./Closet.png')} alt={'Closet'}/>
      <h6>Add some clothes to get started!</h6>
    </div>
  )


  const renderClothesSection = () => {
    // TODO: fix why props.isLoading is always false here, when it should update based on parent state value
    console.log(`props.isLoading: ${props.isLoading}`)
    if (props.isLoading) {
      return null
    }
    return numTotalClothes > 0 ? renderClothesAvailable() : renderNoClothes()
  }

  return (
    <div>
      <div className='filter-items-container'>
        <div> 
          <input className='filter-box' type="text" placeholder='Filter' onChange={filterOnChange}/>
        </div>
        <select onChange={handleChange}>
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
      {renderClothesSection()} 
    </div>
  )
}

export default ClothesList