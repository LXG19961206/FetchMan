import Menu from '../menu'
import Content from '../content'
import style from './index.module.less'

export default () => {
  return (
    <div className={style.wrapper}>
      <Menu></Menu>
      <Content></Content>
    </div>
  )
}