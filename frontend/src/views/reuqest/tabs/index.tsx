import { useRequestStore } from '@/store/request'
import { Tabs, TabPane, Tag, Dropdown } from '@douyinfe/semi-ui'
import style from './style.module.less'
import { observer } from 'mobx-react'
import { IconPlus } from '@douyinfe/semi-icons'

const DEFAULT_TAB_NAME = "unamed request"

export default observer(() => {

  const reqStore = useRequestStore()

  return (
    <div className={style.wrapper}>
      <Tabs
        size="large"
        className={style.tabs}
        type="card"
        lazyRender
        defaultActiveKey="1">
        {
          reqStore.requests.map(req =>
            <TabPane
              tab={
                <span className={style.tabItem}>
                  <Tag color={"teal"}> {req.method.toUpperCase()} </Tag> {req.url || DEFAULT_TAB_NAME}
                </span>
              }
              closable={reqStore.requests.length > 1}
              itemKey={String(req.id)}
              key={req.id}>
            </TabPane>
          )
        }
      </Tabs>
      <div className={style.add_icon}>
        <IconPlus></IconPlus>
      </div>
    </div>
  )
})