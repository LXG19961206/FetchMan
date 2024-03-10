import Menu from '../reuqest/menu'
import style from './index.module.less'
import Request from '@/views/reuqest'
import Response from '@/views/response'
import { observer } from 'mobx-react'
import { useRespStore } from '@/store/resp'
import { RenderIf } from '@/components/headerless/renderIf'
import ResizeableWrapper from '@/components/resizeableWrapper/resizeableWrapper'
import { useEffect, useMemo, useState } from 'react'
import { useTabStore } from '@/store/tab'

export default observer(() => {

  const respStore = useRespStore()
  const tabStore = useTabStore()
  const [wrapper, setWrapper] = useState<HTMLDivElement | null>()
  const [wrapperSize, setWrapperSize] = useState([0, 0])

  useEffect(() => {
    const resize = () => {
      if (wrapper) {
        const { width, height } = wrapper.getBoundingClientRect()
        setWrapperSize([width, height])
      }
    }
    setTimeout(resize)
    window.addEventListener('resize', resize)
    return () => {
      window.removeEventListener('resize', resize)
    }
  }, [wrapper])

  return (
    <div
      className={style.wrapper}>
      <Menu></Menu>
      <div ref={setWrapper} className={style.req_and_resp}>
        <Request></Request>
        <RenderIf when={respStore.shouldRespRender}>
          <ResizeableWrapper
            min={{ height: 200, width: 0 }}
            // max={{ height: statusCtx.size.height * 0.8, width: statusCtx.size.width }}
            top={true}
            className={style.resp}
            style={{ width: wrapperSize[0] + 'px', height: wrapperSize[1] * 0.5 + 'px' }}>
            <Response onClose={() => respStore.removeResp(tabStore.currentViewReqId!)}>
            </Response>
          </ResizeableWrapper>
        </RenderIf>
      </div>
      {/* <Content></Content> */}
    </div>
  )
})