import React from 'react'
import ReactDOM from 'react-dom'
import Pagination from './components/Pagination'
import './scss/index.scss'

class App extends React.Component {
  render() {
    const count = 500
    return <Pagination totalCount={count}/>
  }
}

ReactDOM.render(<App />, document.getElementById('app'))