import style from './index.module.less'
import empty from '@/assets/empty.png'
import { RenderIf } from '../../../components/headerless/renderIf'
import { observer } from 'mobx-react'
import { useToolsStore } from '@/store/tools'
import { useMemo } from 'react'
import tools from './tools'

const toolStore = useToolsStore()

tools.forEach((tool) => {
  toolStore.resignTool(tool)
})

export const ToolMenu = observer(() => {

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
              onClick={() => toolStore.createToolWindow(tool)}
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