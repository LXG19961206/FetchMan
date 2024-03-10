import Menu from './envCollection'
import style from './index.module.less'
import { observer } from 'mobx-react'
import Vars from './var/vars'
export default observer(() => {


  return (
    <div
      className={style.wrapper}>
      <Menu></Menu>
      <Vars></Vars>
    </div>
  )
})