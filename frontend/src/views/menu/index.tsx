import { Input, Dropdown, Modal } from '@douyinfe/semi-ui'
import { RenameFileLikeRequest,DelFileLikeRecord,AddRequestToCollection, LsRequestOfCollection, LsCollectionFolder, AddCollectionFolder, RenameFolder, RemoveCollection } from '../../../wailsjs/go/app/App'
import { filelike, folder } from '../../../wailsjs/go/models'
import { useEffect, useRef, useState } from 'react'
import style from './index.module.less'
import { IconPlusCircle, IconFolder, IconFolderOpen, IconMore } from '@douyinfe/semi-icons'
import empty from './empty.png'
import { RenderIf } from '../../components/headerless/renderIf'
import { throttle } from 'lodash'

type Folder = folder.Folder & {
  isFold: boolean,
}

type FileLike = filelike.FileLike

type NodesStateSetter = React.Dispatch<React.SetStateAction<Folder[]>>
type FileStateSetter = React.Dispatch<React.SetStateAction<FileLike[]>>
type ChildrenUpdater = React.Dispatch<React.SetStateAction<number>>
type EditTargetSetter = React.Dispatch<React.SetStateAction<number>>

// create a set to record which folders are open
const whichAreOpend = new Set<number>()


const lsCurrentFolder = async (id: number) => {
  const res = await LsCollectionFolder(id || 0)
  return (res || []).map(node => ({
    ...node, isFold: !whichAreOpend.has(node.id), isRenaming: false
  }))
}



const appendChild = async (
  parentId: number = 0,
  nodes?: Folder[],
  setter?: NodesStateSetter,
  updater?: ChildrenUpdater
) => {
  const folder = await AddCollectionFolder(`new folder ${+new Date()}`, parentId)

  if (updater) {
    updater(folder.id)
  }

  if (nodes && setter) {
    setter(nodes.map(item => ({ ...item, isFold: item.id !== parentId })))
    whichAreOpend.add(parentId)
  }

  return await lsCurrentFolder(parentId)
}

const rename = async (name: string, node: Folder, setNodes: NodesStateSetter, targetSetter: EditTargetSetter) => {
  await RenameFolder(name, node.id)
  setNodes(await lsCurrentFolder(node.parentId))
  targetSetter(-1)
}

const renameReq = async (name: string, node: FileLike, setNodes: FileStateSetter, targetSetter: EditTargetSetter) => {
  await RenameFileLikeRequest(name, node.id)
  setNodes(await LsRequestOfCollection(node.folderId))
  targetSetter(-1)
}


export default () => {

  const [lastAppendId, updateChild] = useState(-1)

  return (
    <div className={style.wrapper}>
      <div className={style.toolbar}>
        <div
          onClick={() => appendChild(0, void 0, void 0, updateChild)}
          className={style.toolbar_item}>
          <IconPlusCircle size="small"></IconPlusCircle>
          <span> Add New Collection </span>
        </div>
      </div>
      <FolderTree
        parentId={0}
        updateSign={lastAppendId}>
      </FolderTree>
    </div>
  )
}

const delFolder = (node: Folder, setter: NodesStateSetter) => {
  Modal.warning({
    title: 'WARNING',
    content: 'Are you sure to remove this collection record ?',
    onOk: async () => {
      await RemoveCollection(node.id)
      setter(await lsCurrentFolder(node.parentId))
    },
    okText: 'sure',
    cancelText: 'not sure'
  })
}

const toggleFold = (node: Folder, nodes: Folder[], setter: NodesStateSetter) => {

  node.isFold ? whichAreOpend.add(node.id) : whichAreOpend.delete(node.id)

  setter(
    nodes.map(item => (
      item.id === node.id ? { ...item, isFold: !item.isFold } : item
    ))
  )
}

const showMenu = (evt: React.MouseEvent<HTMLDivElement, MouseEvent>, selector: string) => {
  evt.preventDefault()
  evt.stopPropagation()
  var showMenuElement = document.querySelector(`.${selector}`) as HTMLSpanElement
  if (showMenuElement) {
    showMenuElement.click()
  }
}

const addRequest = async (id: number, updater: ChildrenUpdater) => {
  const file = await AddRequestToCollection(id, `new reuqest ${+new Date()}`)
  updater(file.id)
}

const delRequest = async (file: FileLike, setter: FileStateSetter) => {
  Modal.warning({
    title: 'WARNING',
    content: 'Are you sure to remove this collection record ?',
    onOk: async () => {
      await DelFileLikeRecord(file.id)
      setter(await LsRequestOfCollection(file.folderId) || [])
    },
    okText: 'sure',
    cancelText: 'not sure'
  })
}

export const FileLikeRequest = (
  props: {
    parentId: number,
    updateSign: number,
    depth: number
  }
) => {

  const [files, setFiles] = useState<FileLike[]>([])

  const [currentEditId, setEditId] = useState(-1)

  const fetchLasted = () => {
    return LsRequestOfCollection(props.parentId).then(res => {
      setFiles(res || [])
    })
  }

  useEffect(() => {
    fetchLasted().then(() => {
      setEditId(props.updateSign)
    })
  }, [props.updateSign])

  useEffect(() => {
    fetchLasted()
  }, [props.parentId])

  return (
    <div className={style.file_wrapper}>
      {
        files.map(item => (
          <div
            key={item.id}
            style={{ marginLeft: 7 * props.depth + 'px' }}
            onContextMenu={ evt => showMenu(evt, `${style.more_icon + item.id + 'folder'}`) }
            className={style.file_item}>
            <div className={style.file_item_method}> GET </div>
            <div className={style.file_item_title}>
              <RenderIf
                fallback={
                  <Input 
                    autofocus
                    onBlur={evt => renameReq(evt.target.value, item, setFiles, setEditId)}
                    placeholder={"please enter request name..."}
                    defaultValue={item.name}>
                  </Input>
                }
                when={item.id !== currentEditId}>
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
                    onClick={() => delRequest(item, setFiles)}
                    type="danger"> delete this record
                  </Dropdown.Item>
                  <Dropdown.Item
                    onClick={() => setEditId(item.id)}
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
}


export const FolderTree = (props: {
  parentId?: number,
  updateSign?: number
}) => {

  const [nodes, setNodes] = useState<Folder[]>([])
  const [lastAppendId, updateChild] = useState(-1)
  const [lastFileId, updateFile] = useState(-1)
  const [currentEditId, setEditId] = useState(-1)

  const fetchLasted = () => {
    return lsCurrentFolder(props.parentId || 0).then(res => {
      return setNodes(res)
    })
  }

  useEffect(() => {
    fetchLasted().then(() => {
      if (props.updateSign) {
        setEditId(props.updateSign)
      }
    })
  }, [props.updateSign])

  useEffect(() => {
    fetchLasted()
  }, [props.parentId])

  return (
    <RenderIf
      fallback={
        <div className={style.empty_wrapper}>
          <img src={empty} className={style.empty_image} />
          <span className={style.empty}> 暂无记录... </span>
        </div>
      }
      when={!!nodes?.length || !!props.parentId}>
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
                      autofocus
                      onBlur={evt => {
                        rename(evt.target.value, node, setNodes, setEditId)
                      }}
                      defaultValue={node.name}
                      placeholder="please enter collection name...">
                    </Input>
                  }
                  when={currentEditId !== node.id}>
                  <span
                    className={style.folder_title}
                    onClick={() => toggleFold(node, nodes, setNodes)}> {node.name}
                  </span>
                  <Dropdown
                    clickToHide
                    mouseLeaveDelay={0}
                    trigger={"click"}
                    render={
                      <Dropdown.Menu>
                        <Dropdown.Item
                          onClick={() => delFolder(node, setNodes)}
                          type="danger"> delete this record
                        </Dropdown.Item>
                        <Dropdown.Item
                          onClick={() => setEditId(node.id)}
                        > rename this record </Dropdown.Item>
                        <Dropdown.Divider />
                        <Dropdown.Item
                          onClick={() => appendChild(node.id, nodes, setNodes, updateChild)}
                        > add sub folder </Dropdown.Item>
                        <Dropdown.Item
                          onClick={() => addRequest(node.id, updateFile)}
                        > add new request </Dropdown.Item>
                      </Dropdown.Menu>
                    }>
                    <IconMore className={style.more_icon + ' ' + `${style.more_icon}${node.id}`} />
                  </Dropdown>
                </RenderIf>
              </div>

              <RenderIf when={!node.isFold}>
                <FileLikeRequest depth={node.depth + 1} updateSign={lastFileId} parentId={node.id}></FileLikeRequest>
                <FolderTree
                  updateSign={lastAppendId}
                  parentId={node.id}>
                </FolderTree>
              </RenderIf>
            </div>
          ))
        }
      </div>
    </RenderIf>
  )
}