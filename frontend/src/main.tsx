import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './App'




if (!window.go?.app) {
  
  window.location.href = '/'

} else {
  ReactDOM.render(
    <App />, document.getElementById('root')
  )
}



declare global {
  interface Window {
    go: any,
    apis: {
      get <T = unknown>(url: string): Promise<T>
    }
  }
}