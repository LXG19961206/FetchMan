import { Tabs, TabPane, Tag, Dropdown, Input } from '@douyinfe/semi-ui'
import style from './style.module.less'
import { observer } from 'mobx-react'
import { IconPlusCircleStroked } from '@douyinfe/semi-icons'
import { useTabStore } from '@/store/tab'
import { useEffect, useState } from 'react'
import UrlAndMethod from '../urlMethodBar/index'
import ReqInfo from '../reqInfo'
import { RenderIf } from '@/components/headerless/renderIf'
import MethodTag from '@/components/methodTag'

export default observer(() => {

  const tabStore = useTabStore()

  const [editId, setEditId] = useState(0)

  useEffect(() => {
    tabStore.getAllWindow().then(res => {
      if (res.length) {
        tabStore.changeTab(res[res.length - 1].requestId)
      }
    })
  }, [])

  return (
    <div className={style.wrapper}>
      <Tabs
        size="small"
        onChange={(id) => tabStore.changeTab(+id)}
        className={style.tabs}
        type="card"
        onTabClose={(id) => tabStore.delTab(+id)}
        lazyRender
        activeKey={tabStore.currentId + ''}
        defaultActiveKey="1">
        {
          tabStore.tabs.map(tab =>
            <TabPane
              style={{ padding: 0, margin: 0, width: '100%' }}
              tab={
                <Dropdown 
                  clickToHide
                  mouseLeaveDelay={0}
                  trigger='contextMenu'
                  render={
                    <Dropdown.Menu>
                      <Dropdown.Item onClick={() => tabStore.delTab(tab.id)}> Delete This Request </Dropdown.Item>
                      <Dropdown.Item onClick={() => setEditId(tab.id)}> Rename This Request </Dropdown.Item>
                      <Dropdown.Item onClick={() => tabStore.duplicateTab(tab.id)}> Duplicate This Request </Dropdown.Item>
                    </Dropdown.Menu>
                  }>
                  <span className={style.tabItem}>
                    <MethodTag method={tab.method}></MethodTag>
                    <RenderIf 
                      fallback={<span> {tab.name || tab.url} </span>}
                      when={editId === tab.id}>
                      <Input
                        onBlur={(evt) => {
                          setEditId(0)
                          tabStore.rename(evt.target.value, tab.id)
                        }}
                        className={style.rename}
                        autoFocus
                        defaultValue={tab.name}>
                      </Input>
                    </RenderIf>
                  </span>
                </Dropdown>
              }
              closable={!editId}
              itemKey={String(tab.id)}
              key={tab.id}>
              <div className={style.content}>
                <UrlAndMethod></UrlAndMethod>
                <ReqInfo></ReqInfo>
              </div>
            </TabPane>
          )
        }
        <TabPane
          itemKey={String(-1)}
          key={-1}
          icon={<IconPlusCircleStroked></IconPlusCircleStroked>}
          style={{ width: '0' }}>
        </TabPane>
      </Tabs>
    </div>
  )
})