import style from './layout.module.css'
import Side from './side'
import Header from './header'

export default () => {
  return (
    <div className={style.layout}>
      <div className={style.app_header}>
        <Header></Header>
      </div>
      <div className={style.app_content}>
          <div className={style.content_side_menu}>
            <Side></Side>
          </div>
      </div>
    </div>
  )
}