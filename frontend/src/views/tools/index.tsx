import Menu from './toolsMenu'
import style from './index.module.less'
import { observer } from 'mobx-react'

export default observer(() => {

  return (
    <div
      className={style.wrapper}>
      <Menu></Menu>
      {/* <InjectInput onChange={setT}></InjectInput> */}
    </div>
  )
})