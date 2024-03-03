import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './App'




if (!window.go) {
  location.replace('/')
} else {
  ReactDOM.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
    document.getElementById('root')
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