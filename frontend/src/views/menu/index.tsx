import { Tooltip } from '@douyinfe/semi-ui'
import style from './index.module.less'
import { FolderTree } from './folder'
import addFile from './addFile.png'
import refresh from './refresh.png'
import { BaseProps } from '@/models/base'
import { workplaceStore } from '@/store/workplace'


export default (props: BaseProps) => {
  return (
    <div
      style={props.style} 
      className={style.wrapper}>
      <div className={style.toolbar}>
        <Tooltip
          content="Add a collection" 
          trigger='hover'>
          <div
            onClick={() => workplaceStore.addFolder(0)}
            className={style.toolbar_item}>
            <img src={addFile} alt="" />
          </div>
        </Tooltip>
        <Tooltip
          content="Get the lasted collection list" 
          trigger='hover'>
          <div
            className={style.toolbar_item}>
            <img src={refresh} alt="" />
          </div>
        </Tooltip>
      </div>
      <FolderTree
        parentId={0}>
      </FolderTree>
    </div>
  )
}