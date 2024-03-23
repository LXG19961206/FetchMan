import { useMemo, useState } from 'react'
import style from './index.module.less'
import { Tabs, TabPane } from '@douyinfe/semi-ui'
import { useToolsStore } from '@/store/tools'
import { observer } from 'mobx-react'
import JSON2ts from './tools/json2ts'



export default observer(() => {

  const toolStore = useToolsStore()
  return (
    <div className={style.content}>
      <Tabs
        activeKey={toolStore.currentId}
        onChange={id => toolStore.setCurrent(id)}
        onTabClose={id => delete toolStore.currentOpenItems[id]}
        size="small"
        className={style.tabs}
        type="card"
        lazyRender>
        {
          Object.entries(toolStore.currentOpenItems).map(([id, tab]) => (
            <TabPane 
              key={id}
              style={{ height: 'inherit' }}
              itemKey={id} 
              closable
              icon={tab.icon}
              tab={tab.name}>
              <tab.render></tab.render>
            </TabPane>
          ))
        }
      </Tabs>
    </div>
  )
})