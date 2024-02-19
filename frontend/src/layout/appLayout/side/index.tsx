import { Tabs, TabPane } from '@douyinfe/semi-ui';
import TabItemContent from './tabItemContent'
import { router } from '@/router'
import { useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const sideMenus = router.filter(route => route.inSideMenu)

export default () => {

  const nav = useNavigate()

  const SideMenus = useMemo(() => sideMenus.map(menu => (
    <TabPane
      key={menu.path}
      itemKey={menu.path}
      tab={<TabItemContent 
        Icon={menu.icon} 
        title={menu.title} />}>
    </TabPane>
  )), [])

  return (
    <Tabs
      tabPosition="left"
      onTabClick={(path) => nav(path)}
      type={"line"}>
      {SideMenus}
    </Tabs>
  )
}


