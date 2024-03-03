import { useRequestStore } from '@/store/request'
import { observer } from 'mobx-react'
import style from './index.module.less'
import { BaseProps } from '@/models/base'
import Tabs from './tabs'
import UrlAndMethod from './urlMethodBar/index'
import ReqInfo from './reqInfo'

export default observer((props: BaseProps) => {
  return (
    <div
      style={props.style} 
      className={style.wrapper}>
      <Tabs></Tabs>
      <div className={style.content}>
        <UrlAndMethod></UrlAndMethod>
        <ReqInfo></ReqInfo>
      </div>
    </div>
  )
})