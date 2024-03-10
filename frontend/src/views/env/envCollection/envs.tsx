import { Input, Dropdown } from '@douyinfe/semi-ui'
import style from './index.module.less'
import { IconMore, IconBranch } from '@douyinfe/semi-icons'
import empty from '@/assets/empty.png'
import { RenderIf } from '../../../components/headerless/renderIf'
import { throttle } from 'lodash'
import { observer } from 'mobx-react'
import { useEnvStore } from '@/store/var'

const showMenu = (evt: React.MouseEvent<HTMLDivElement, MouseEvent>, selector: string) => {
  evt.preventDefault()
  evt.stopPropagation()
  var showMenuElement = document.querySelector(`.${selector}`) as HTMLSpanElement
  if (showMenuElement) {
    showMenuElement.click()
  }
}


export const Envs = observer(() => {

  const envStore = useEnvStore()

  return (
    <RenderIf
      when={!!envStore.env.length}
      fallback={
        <div className={style.empty_wrapper}>
          <img src={empty} className={style.empty_image} />
          <span className={style.empty}> No env collection, please add </span>
        </div>
      }>
      <div className={style.folder_wrapper}>
        {
          envStore.env.map((node) => (
            <div
              onClick={() => envStore.setCurrent(node.id)}
              onContextMenu={throttle((evt) => showMenu(evt, `${style.more_icon}${node.id}`), 200)}
              key={node.id}>
              <div className={
                envStore.currentEnvId === node.id
                  ? `${style.folder} ${style.active}`
                  : style.folder
              }>
                <IconBranch></IconBranch>
                <RenderIf
                  fallback={<span className={style.folder_title}> {node.name}</span>}
                  when={node.id === envStore.currentEdit}>
                  <Input
                    autoFocus
                    onBlur={evt => envStore.renameEnv(node.id, evt.target.value)}
                    defaultValue={node.name}
                    placeholder="please enter env name...">
                  </Input>
                </RenderIf>
                <Dropdown
                  clickToHide
                  mouseLeaveDelay={100}
                  trigger={"click"}
                  render={
                    <Dropdown.Menu>
                      <Dropdown.Item
                        onClick={() => envStore.delEnv(node.id)}
                        type="danger"> Delete This Env
                      </Dropdown.Item>
                      <Dropdown.Item
                        onClick={() => envStore.currentEdit = node.id}
                      > Rename This Record </Dropdown.Item>
                    </Dropdown.Menu>
                  }>
                  <IconMore className={style.more_icon + ' ' + `${style.more_icon}${node.id}`} />
                </Dropdown>
              </div>

            </div>
          ))
        }
      </div>
    </RenderIf>
  )
})