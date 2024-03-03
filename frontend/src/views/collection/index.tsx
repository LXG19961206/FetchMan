import Menu from '../menu'
import style from './index.module.less'
import Request from '@/views/reuqest'
import Content from '@/views/content'

export default () => {
  return (
    <div className={style.wrapper}>
      <Menu></Menu>
      <Request></Request>
      {/* <Content></Content> */}
    </div>
  )
}