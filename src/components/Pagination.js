import React, { useEffect, useState } from 'react'

const Pagination = (props) => {
  const elementsCount = props.totalCount
  const [elementsOnPage, setElementsOnPage] = useState(localStorage.getItem('elementsOnPage') || 10)
  const [pagesCount, setPagesCount] = useState(Math.ceil(elementsCount/elementsOnPage))
  const [lastPageNumber, setLastPageNumber] = useState(localStorage.getItem('lastPageNumber') || '1')
  const [items, setItems] = useState([])
  const pageIsFirst = lastPageNumber == 1
  const pageIsLast = lastPageNumber == pagesCount
  const [chosenPage, setChosenPage] = useState(1)

  const updateLastPageInfo = (newValue) => {
    localStorage.setItem('lastPageNumber', newValue)
    setLastPageNumber(newValue)
  }

  const changePerPage = e => {
    const value = e.target.value
    const pages = Math.ceil(elementsCount/value)
    const nextPage = Math.floor((lastPageNumber*elementsOnPage-elementsOnPage+(+value))/value)
    updateLastPageInfo(nextPage)

    localStorage.setItem('elementsOnPage', value)
    setElementsOnPage(value)
    setPagesCount(pages)
  }

  const openPage = e => {
    const element = e.target
    if (element.tagName == 'LI') {
      updateLastPageInfo(element.textContent)
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
    const elementsContains = lastPageNumber*elementsOnPage
    const startValue = (lastPageNumber-1)*elementsOnPage+1
    const lastValue = elementsContains > elementsCount 
      ? elementsContains-(elementsContains-elementsCount)
      : elementsContains
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
      <div className="item-description">{item.title}</div>
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
    
    return (
      <>
        <ul className="pagination-list" onClick={openPage} onMouseDown={e => e.preventDefault()}>
          <button style={{width: 'auto'}} className={`pagination-list-switch_button${pageIsFirst ? ' disabled' : ''}`} disabled={pageIsFirst} onClick={() => updateLastPageInfo(lastPageNumber-1)}>{'<'}</button>
          {arr}
          <button style={{width: 'auto'}} className={`pagination-list-switch_button${pageIsLast ? ' disabled' : ''}`} disabled={pageIsLast} onClick={() => updateLastPageInfo(+lastPageNumber+1)}>{'>'}</button>
        </ul>
        <div className="pagination-chose_page">
          <span className="pagination-chose_page-max">Switch<br/>{`Pages: ${pagesCount}`}</span>
          <input className="pagination-chose_page-input" type="number" value={chosenPage} onChange={e => {
            const element = e.target
            if (element.value < 1) element.value = 1 
            if (element.value > pagesCount) element.value = pagesCount
            setChosenPage(element.value)
            }}/>
          <button className="pagination-chose_page-confirm_button" onClick={() => updateLastPageInfo(chosenPage)}>OK</button>
        </div>
      </>
    )
  }

  return (
    <div className="content">
      <div className="content-header">
      <span>{`Elements per page: `}</span>
      <select className="header-per_page_select" onChange={changePerPage} defaultValue={elementsOnPage}>
        {perPageSelecter(10, 50, 100)}
      </select>
      </div>
      <div className="pagination">
        {createPagination(7)}
      </div>
      <div className="content-body">
        {bodyCreator()}
      </div>
      <div className="pagination">
        {createPagination(7)}
        
      </div>
     
    </div>
  )
}

export default Pagination