import { useRequestStore } from '@/store/request'
import { Tabs, TabPane, Tag } from '@douyinfe/semi-ui'
import style from './style.module.less'
import { observer } from 'mobx-react'

const DEFAULT_TAB_NAME = "unamed request"

export default observer(() => {

  const reqStore = useRequestStore()

  return (
    <div className={style.wrapper}>
      <Tabs
        size="large"
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
              itemKey={req.id}
              key={req.id}>
            </TabPane>
          )
        }
      </Tabs>
    </div>
  )
})