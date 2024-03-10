import '@/App.css'
import Layout from '@/layout/appLayout'
import { request } from '@/util/http'
import { useEffect } from 'react'
import { RequestMethod } from './dicts/methods'
import { observer } from 'mobx-react'

function App() {

  useEffect(() => {

    window.addEventListener('contextmenu', (evt) => {
      // evt.preventDefault()
    })

  }, [])

  return <>
    {/* <Side></Side> */}
    {/* <Menu></Menu>
    <Content></Content> */}
    <Layout></Layout>
  </>
}




export default App
