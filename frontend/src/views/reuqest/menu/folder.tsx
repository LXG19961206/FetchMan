import { Input, Dropdown } from '@douyinfe/semi-ui'
import { useEffect, useMemo } from 'react'
import style from './index.module.less'
import { IconFolder, IconFolderOpen, IconMore } from '@douyinfe/semi-icons'
import empty from '@/assets/empty.png'
import { RenderIf } from '../../../components/headerless/renderIf'
import { throttle } from 'lodash'
import { useWorkplaceStore } from '@/store/workplace'
import FileLike from './fileLike'
import { observer } from 'mobx-react'

const showMenu = (evt: React.MouseEvent<HTMLDivElement, MouseEvent>, selector: string) => {
  evt.preventDefault()
  evt.stopPropagation()
  var showMenuElement = document.querySelector(`.${selector}`) as HTMLSpanElement
  if (showMenuElement) {
    showMenuElement.click()
  }
}


export const FolderTree = observer((props: {
  parentId: number
}) => {

  const workplaceStore = useWorkplaceStore()

  useEffect(() => {
    workplaceStore.lsTargetFolder(props.parentId)
  }, [props.parentId])

  const nodes = useMemo(() => {
    return workplaceStore.folderMap.get(props.parentId) || []
  }, [
    workplaceStore.folderMap.get(props.parentId),
    workplaceStore.whichAreOpened
  ])

  const files = useMemo(() => {
    return workplaceStore.fileLikeMap.get(props.parentId) || []
  }, [workplaceStore.fileLikeMap.get(props.parentId)])

  return (
    <RenderIf
      when={!!nodes.length || !!files.length}
      fallback={
        <div className={style.empty_wrapper}>
          <img src={empty} className={style.empty_image} />
          <span className={style.empty}> 暂无记录... </span>
        </div>
      }>
      <div className={style.folder_wrapper}>
        {
          nodes.map((node, idx) => (
            <div
              onContextMenu={throttle((evt) => showMenu(evt, `${style.more_icon}${node.id}`), 200)}
              style={{ marginLeft: 7 * node.depth + 'px' }} key={node.id}>
              <div
                className={style.folder}>
                <RenderIf
                  fallback={<IconFolderOpen></IconFolderOpen>}
                  when={node.isFold}>
                  <IconFolder></IconFolder>
                </RenderIf>
                <RenderIf
                  fallback={
                    <Input
                      autoFocus
                      onBlur={evt => {
                        workplaceStore.reanemdFolder(evt.target.value, node.id, node.parentId)
                      }}
                      defaultValue={node.name}
                      placeholder="please enter collection name...">
                    </Input>
                  }
                  when={workplaceStore.currentEditFolderId !== node.id}>
                  <span
                    className={style.folder_title}
                    onClick={() => workplaceStore.toggleFolderStatus(node)}> {node.name}
                  </span>
                  <Dropdown
                    clickToHide
                    mouseLeaveDelay={100}
                    trigger={"click"}
                    render={
                      <Dropdown.Menu>
                        <Dropdown.Item
                          onClick={() => workplaceStore.delFolder(node.id, node.parentId)}
                          type="danger"> Delete This Record
                        </Dropdown.Item>
                        <Dropdown.Item
                          onClick={() => workplaceStore.currentEditFolderId = node.id}
                        > Rename This Record </Dropdown.Item>
                        <Dropdown.Divider />
                        <Dropdown.Item
                          onClick={() => workplaceStore.addFolder(node.id)}
                        > Add Sub Folder </Dropdown.Item>
                        <Dropdown.Item
                          onClick={() => workplaceStore.addRequest(node)}
                        > Add New Request </Dropdown.Item>
                      </Dropdown.Menu>
                    }>
                    <IconMore className={style.more_icon + ' ' + `${style.more_icon}${node.id}`} />
                  </Dropdown>
                </RenderIf>
              </div>

              <RenderIf when={!node.isFold}>
                <FileLike 
                  depth={node.depth + 1} 
                  parentId={node.id}>
                </FileLike>
                <FolderTree
                  parentId={node.id}>
                </FolderTree>
              </RenderIf>
            </div>
          ))
        }
      </div>
    </RenderIf>
  )
})