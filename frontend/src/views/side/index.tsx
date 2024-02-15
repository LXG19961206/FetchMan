import { Tabs, TabPane } from '@douyinfe/semi-ui';
import { IconAppCenter, IconTerminal, IconSend, IconGlobe } from '@douyinfe/semi-icons';
import TabItemContent from './tabItemContent'
import { router } from '../../router'
import { BrowserRouter } from 'react-router-dom'

const sideMenus = router.filter(route => route.inSideMenu)

export default () => {
  return (
    <BrowserRouter>
      <Tabs
        tabPosition="left"
        type={"line"}>
        {
          sideMenus.map(menu => (
            <TabPane
              key={menu.name}
              tab={<TabItemContent 
              Icon={menu.icon} title="Api" />}
              itemKey={menu.path}>
            </TabPane>
          ))
        }
      </Tabs>
    </BrowserRouter>
  )
}


