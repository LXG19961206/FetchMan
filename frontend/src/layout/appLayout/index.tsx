import style from './layout.module.css'
import Side from './side'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import { router } from '@/router/index'

export default () => {
  return (
    <div className={style.layout}>
      <div className={style.app_header}></div>
      <Router>
        <div className={style.app_content}>
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
        </div>
      </Router>
    </div>
  )
}