import React, { useEffect, useState } from 'react'

const Pagination = (props) => {
  const elementsCount = props.totalCount
  const [elementsOnPage, setElementsOnPage] = useState(localStorage.getItem('elementsOnPage') || 10)
  const [pagesCount, setPagesCount] = useState(Math.ceil(elementsCount/elementsOnPage))
  const [lastPageNumber, setLastPageNumber] = useState(localStorage.getItem('lastPageNumber') || '1')
  const [items, setItems] = useState([])
  

  const changePerPage = e => {
    const value = e.target.value
    const pages = Math.ceil(elementsCount/value)
    if (pages < lastPageNumber) {
      localStorage.setItem('lastPageNumber', pages)
      setLastPageNumber(pages)
    }
    localStorage.setItem('elementsOnPage', value)
    setElementsOnPage(value)
    setPagesCount(pages)
  }

  const openPage = e => {
    if (e.target.tagName == 'LI') {
      localStorage.setItem('lastPageNumber', e.target.textContent)
      setLastPageNumber(e.target.textContent)
      e.target.className = 'selected-page'
      e.preventDefault()
    }
  }

  const perPageSelecter = (...args) => {
    const arr = []
    for (let i=0; i<args.length; i++) {
      if (localStorage.getItem('elementsOnPage') == args[i]) {
        arr.push(<option key={`perPage${i}`} value={args[i]}>{args[i]}</option>)
      } else {
        arr.push(<option key={`perPage${i}`}>{args[i]}</option>)
      }
    }
    return arr
  }

  const getItems = () => {
    let uri = 'https://jsonplaceholder.typicode.com/photos?'
    const query = []
    const startValue = (lastPageNumber-1)*elementsOnPage+1
    const lastValue = lastPageNumber*elementsOnPage
    for (let i=startValue; i<=lastValue; i++) {
      query.push(`id=${i}`)
    }
    uri+= query.join('&')

    useEffect(() => {
      const fetchData = async () => {
        const result = await fetch(uri)
        const res = await result.json()
        setItems(res)
      }
      fetchData()
    }, [elementsOnPage, lastPageNumber])
  }
  const bodyCreator = () => {
    getItems() 
    return items.map((item, index) => (
    <div className="item" key={`item${index}`}>
      <img className="item-image" src={item.thumbnailUrl}/>
      <div>{item.title}</div>
    </div>
    ))
  } 

  const createPagination = (count) => {
    if (pagesCount < count) count = pagesCount
    const arr = []
    let lessCount = Math.ceil(count/2)-1
    let highCount = Math.floor(count/2)
    let startingValue = lastPageNumber-lessCount
    let lastValue = +lastPageNumber+highCount
    while (startingValue < 1 || pagesCount < lastValue) {
      if (startingValue < 1) {
        lessCount--
        highCount++
      } else { 
        lessCount++
        highCount--
      }
      startingValue = lastPageNumber-lessCount
      lastValue = +lastPageNumber+highCount
    }
    for (let i=startingValue; i<=lastValue; i++) {
      if (i != +lastPageNumber) {
        arr.push(<li key={`page${i}`}>{i}</li>)
      } else {
        arr.push(<li className="selected" key={`page${i}`}>{i}</li>)
      }
    }
    return arr
  }

  return (
    <div className="content">
      <div className="content-header">
      <span>Elements per page:</span>
      <select onChange={changePerPage} defaultValue={elementsOnPage}>
        {perPageSelecter(10, 50, 100)}
      </select>
      </div>
      <div className="content-body">
        {bodyCreator()}
      </div>
      <div className="pagination">
        <ul className="pagination-list" onClick={openPage}>
          <button disabled={lastPageNumber == 1 ? true : false} onClick={() => {
            localStorage.setItem('lastPageNumber', lastPageNumber-1)
            setLastPageNumber(lastPageNumber-1)
          }}>{'<'}</button>

          {createPagination(7)}
          
          <button disabled={lastPageNumber == pagesCount ? true : false} onClick={() => {
            localStorage.setItem('lastPageNumber', +lastPageNumber+1)
            setLastPageNumber(+lastPageNumber+1)
          }}>{'>'}</button>
        </ul>
      </div>
     
    </div>
  )
}

export default Pagination