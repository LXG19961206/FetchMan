import React from 'react';
import { Tabs, TabPane } from '@douyinfe/semi-ui';
import { IconAppCenter, IconTerminal, IconSend, IconGlobe } from '@douyinfe/semi-icons';
import TabItemContent from './tabItemContent'
import Menu from './menu';

export default () => {
  return (
  <Tabs
    tabPosition="left"
    type={"line"}>
    <TabPane
      tab={<TabItemContent Icon={IconAppCenter} title="Project"/>}
      itemKey="1"
    >
    </TabPane>
    <TabPane
      tab={<TabItemContent Icon={IconSend} title="Api"/>}
      itemKey="2"
    >
    </TabPane>
    <TabPane
      tab={<TabItemContent Icon={IconTerminal} title="Terminal"/>}
      itemKey="3"
    >
    </TabPane>
    <TabPane
      tab={<TabItemContent Icon={IconSend} title="QuickRequest"/>}
      itemKey="4"
    >
      <Menu></Menu>
    </TabPane>
    <TabPane
      tab={<TabItemContent Icon={IconGlobe} title="EnvConfig"/>}
      itemKey="5"
    >
    </TabPane>
  </Tabs>
  )
}


