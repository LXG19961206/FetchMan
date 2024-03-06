import Menu from '../menu'
import style from './index.module.less'
import Request from '@/views/reuqest'
import Response from '@/views/response'
import { observer } from 'mobx-react'
import { useRespStore } from '@/store/resp'
import { RenderIf } from '@/components/headerless/renderIf'
import { SideSheet } from '@douyinfe/semi-ui'
import ResizeableWrapper from '@/components/resizeableWrapper/resizeableWrapper'
import { useEffect, useState } from 'react'

export default observer(() => {

  const respStore = useRespStore()
  const [wrapper, setWrapper] = useState<HTMLDivElement | null>()
  const [wrapperSize, setWrapperSize] = useState([0, 0])

  useEffect(() => {
    setTimeout(() => {
      if (!wrapper) return
      setWrapperSize([wrapper.clientWidth, wrapper.clientHeight])
    })
  }, [wrapper])

  return (
    <div
      className={style.wrapper}>
      <Menu></Menu>
      <div ref={setWrapper} className={style.req_and_resp}>
        <Request></Request>
        <RenderIf when={!!respStore.currentViewResp}>
          <ResizeableWrapper
            min={{ height: 200, width: 0 }}
            // max={{ height: statusCtx.size.height * 0.8, width: statusCtx.size.width }}
            top={true}
            className={style.resp}
            style={{ width: wrapperSize[0] + 'px', height: wrapperSize[1] * 0.5 + 'px' }}>
            <Response onClose={() => respStore.currentViewResp = null}>
            </Response>
          </ResizeableWrapper>
        </RenderIf>
      </div>
      {/* <Content></Content> */}
    </div>
  )
})