import React, { useState } from 'react';
import { Tabs, TabPane, List } from '@douyinfe/semi-ui';
import { IconSendStroked, IconPlusCircle } from '@douyinfe/semi-icons';


export default () => {

  const [tabList, setList] = useState([
    { tab: <span><IconSendStroked/> new request </span>, itemKey: '1', closable: true },
    { tab: '快速起步', itemKey: '2', closable: true },
    { tab: <span><IconPlusCircle/> new request </span>, itemKey: '3'},
  ])

  const close = (key: string) => {
    const newTabList = [...tabList];
    setList(
      tabList.filter(item => item.itemKey !== key)
    )
  }
  return (
    <Tabs
      size="large"
      type="card"
      defaultActiveKey="1"
      onTabClose={close}>
      {
        tabList.map(t => 
          <TabPane 
            closable={t.closable} 
            tab={t.tab} 
            itemKey={t.itemKey}
            key={t.itemKey}>
          </TabPane>
        )
      }
    </Tabs>
  );
}

