import Menu from '../menu'
import style from './index.module.less'
import Request from '@/views/reuqest'
import Content from '@/views/content'
import Response from '@/views/response'
import { observer } from 'mobx-react'
import { useRespStore } from '@/store/resp'
import { RenderIf } from '@/components/headerless/renderIf'

export default observer(() => {

  const respStore = useRespStore()

  return (
    <div className={style.wrapper}>
      <Menu></Menu>
      <Request></Request> 
      <RenderIf when={!!respStore.currentViewResp}>
        <Response></Response>
      </RenderIf>
      {/* <Content></Content> */}
    </div>
  )
})