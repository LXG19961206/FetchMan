import { Tabs, TabPane } from '@douyinfe/semi-ui';
import TabItemContent from './tabItemContent'
import { router } from '@/router'
import { useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { IconProps } from '@douyinfe/semi-icons';

const sideMenus = router.filter(route => route.inSideMenu)

export default () => {

  const nav = useNavigate()
  const location = useLocation()
  const [path, setPath] = useState(location.pathname)

  type Icon = React.ForwardRefExoticComponent<Omit<Omit<IconProps, "type" | "svg">, "ref"> & React.RefAttributes<HTMLSpanElement>>

  const SideMenus = useMemo(() => sideMenus.map(menu => (
    <TabPane
      key={menu.path}
      itemKey={menu.path}
      tab={<TabItemContent 
        Icon={ menu.icon as unknown as Icon } 
        title={menu.title} />}>
    </TabPane>
  )), [])

  return (
    <Tabs
      activeKey={path}
      onChange={setPath}
      tabPosition="left"
      onTabClick={(path) => nav(path)}
      type={"line"}>
      {SideMenus}
    </Tabs>
  )
}


