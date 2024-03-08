import { observer } from 'mobx-react'
import style from './index.module.less'
import { BaseProps } from '@/models/base'
import Tabs from './tabs'

export default observer((props: BaseProps) => {

  return (
    <div
      style={props.style}
      className={style.wrapper}>
      <Tabs></Tabs>
    </div>
  )
})