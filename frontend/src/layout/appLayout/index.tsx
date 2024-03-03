import style from './layout.module.css'
import Side from './side'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import { router } from '@/router/index'
import Header from './header'

export default () => {
  return (
    <div className={style.layout}>
      <div className={style.app_header}>
        <Header></Header>
      </div>
      <div className={style.app_content}>
        <Router>
          <div className={style.content_side_menu}>
            <Side></Side>
          </div>
          <div className={style.content_content_area}>
            <Routes>
              {
                router.map(item => (
                  <Route
                    key={item.path}
                    path={item.path}
                    element={<item.element></item.element>}>
                  </Route>
                ))
              }
            </Routes>
          </div>
        </Router>
      </div>
    </div>
  )
}