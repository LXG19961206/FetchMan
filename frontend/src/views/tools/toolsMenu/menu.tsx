import { Input } from '@douyinfe/semi-ui'
import style from './index.module.less'
import { IconBranch } from '@douyinfe/semi-icons'
import empty from '@/assets/empty.png'
import { RenderIf } from '../../../components/headerless/renderIf'
import { observer } from 'mobx-react'
import { useToolsStore } from '@/store/tools'
import { useMemo } from 'react'



export const ToolMenu = observer(() => {

  const toolStore = useToolsStore()

  const tools = useMemo(() => {
    return [...toolStore.tools]
  }, [toolStore.tools])

  return (
    <RenderIf
      when={!!toolStore.tools.size}
      fallback={
        <div className={style.empty_wrapper}>
          <img src={empty} className={style.empty_image} />
          <span className={style.empty}> No env collection, please add </span>
        </div>
      }>
      <div className={style.folder_wrapper}>
        {
          tools.map((tool) => (
            <div
              key={tool.id}>
              <div className={style.folder}>
                { tool.icon }
                <span className={style.folder_title}> {tool.name}</span>
              </div>
            </div>
          ))
        }
      </div>
    </RenderIf>
  )
})