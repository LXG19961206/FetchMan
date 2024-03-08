import { Tabs, TabPane, Tag, Dropdown } from '@douyinfe/semi-ui'
import style from './style.module.less'
import { observer } from 'mobx-react'
import { IconPlusCircleStroked } from '@douyinfe/semi-icons'
import { useTabStore } from '@/store/tab'
import { useEffect } from 'react'
import UrlAndMethod from '../urlMethodBar/index'
import ReqInfo from '../reqInfo'

export default observer(() => {

  const tabStore = useTabStore()

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
                <span className={style.tabItem}>
                  <Tag color={"teal"}> {tab.method} </Tag> {tab.name}
                </span>
              }
              closable
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