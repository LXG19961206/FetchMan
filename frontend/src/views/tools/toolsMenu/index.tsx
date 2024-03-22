import { Tooltip, Select } from '@douyinfe/semi-ui'
import style from './index.module.less'
import { BaseProps } from '@/models/base'
import addFile from '@/assets/addFile.png'
import { useToolsStore } from '@/store/tools'
import { useEffect } from 'react'
import { ToolMenu } from './menu'
import { observer } from 'mobx-react'
export default observer((props: BaseProps) => {

  const toolsStore = useToolsStore()

  useEffect(() => {

  }, [])

  return (
    <div
      style={props.style}
      className={style.wrapper}>
      <div className={style.toolbar}>
        <div
          className={style.toolbar_item}>
            TOOLS
        </div>
      </div>
      <ToolMenu></ToolMenu>
    </div>
  )
})