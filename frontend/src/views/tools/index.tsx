import Menu from './toolsMenu'
import style from './index.module.less'
import { observer } from 'mobx-react'
import Content from './content'


export default observer(() => {

  

  return (
    <div
      className={style.wrapper}>
      <Menu></Menu>
      <Content></Content>
      {/* <InjectInput onChange={setT}></InjectInput> */}
    </div>
  )
})