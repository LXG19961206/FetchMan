import { Input, Dropdown } from '@douyinfe/semi-ui'
import { useEffect, useMemo } from 'react'
import style from './index.module.less'
import { IconMore } from '@douyinfe/semi-icons'
import { RenderIf } from '../../components/headerless/renderIf'
import { useWorkplaceStore } from '@/store/workplace'
import MethodTag from '@/components/methodTag'
import { observer } from 'mobx-react'

const showMenu = (evt: React.MouseEvent<HTMLDivElement, MouseEvent>, selector: string) => {
  evt.preventDefault()
  evt.stopPropagation()
  var showMenuElement = document.querySelector(`.${selector}`) as HTMLSpanElement
  if (showMenuElement) {
    showMenuElement.click()
  }
}

export default observer((
  props: {
    parentId: number,
    depth: number
  }
) => {

  const workplaceStore = useWorkplaceStore()

  useEffect(() => {
    workplaceStore.lsFilesOfFolder(props.parentId)
  }, [props.parentId])

  const files = useMemo(() => {
    return workplaceStore.fileLikeMap.get(props.parentId) || []
  }, [workplaceStore.fileLikeMap.get(props.parentId)])


  return (
    <div className={style.file_wrapper}>
      {
        files.map(item => (
          <div
            key={item.id}
            onClick={() => workplaceStore.viewRequest(item.id, item.name, item.tag)}
            style={{ marginLeft: 7 * props.depth + 'px' }}
            onContextMenu={evt => showMenu(evt, `${style.more_icon + item.id + 'folder'}`)}
            className={style.file_item}>
            {/* <div className={style.file_item_method}> GET </div> */}
            <MethodTag method={item.tag}></MethodTag>
            <div className={style.file_item_title}>
              <RenderIf
                fallback={
                  <Input
                    autoFocus
                    onBlur={evt => workplaceStore.renameRequest(evt.target.value, item.id, props.parentId)}
                    placeholder={"please enter request name..."}
                    defaultValue={item.name}>
                  </Input>
                }
                when={item.id !== workplaceStore.currentEditRequestId}>
                {item.name}
              </RenderIf>
            </div>
            <Dropdown
              clickToHide
              mouseLeaveDelay={0}
              trigger={"click"}
              render={
                <Dropdown.Menu>
                  <Dropdown.Item
                    onClick={() => workplaceStore.delRequest(item.id, props.parentId)}
                    type="danger"> delete this record
                  </Dropdown.Item>
                  <Dropdown.Item
                    onClick={() => workplaceStore.currentEditRequestId = item.id}
                  > rename this record </Dropdown.Item>
                  <Dropdown.Divider />
                </Dropdown.Menu>
              }>
              <IconMore className={style.more_icon + ' ' + `${style.more_icon + item.id + 'folder'}`} />
            </Dropdown>
          </div>
        ))
      }
    </div>
  )
})
