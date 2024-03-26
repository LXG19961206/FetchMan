import { Tabs, TabPane } from '@douyinfe/semi-ui';
import TabItemContent from './tabItemContent'
import { router } from '@/router'
import { useMemo, useState } from 'react';
import { IconProps } from '@douyinfe/semi-icons';

const sideMenus = router.filter(route => route.inSideMenu)

export default () => {

  const [path, setPath] = useState(sideMenus[0].path)

  type Icon = React.ForwardRefExoticComponent<Omit<Omit<IconProps, "type" | "svg">, "ref"> & React.RefAttributes<HTMLSpanElement>>

  const SideMenus = useMemo(() => sideMenus.map(menu => (
    <TabPane
      key={menu.path}
      itemKey={menu.path}
      tab={<TabItemContent 
      Icon={ menu.icon as unknown as Icon } 
      title={menu.title} />}>
        {
          <div>
            <menu.element></menu.element>
          </div>
        }
    </TabPane>
  )), [])

  return (
    <Tabs
      contentStyle={{ flexGrow: 1, height: 'inherit' }}
      activeKey={path}
      style={{ width: '100vw' }}
      onChange={setPath}
      tabPosition="left"
      type={"line"}>
      {SideMenus}
    </Tabs>
  )
}


