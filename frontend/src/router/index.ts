import { IconAppCenter, IconTerminal, IconSend, IconGlobe } from '@douyinfe/semi-icons';

export const router = [
  {
    path: '/env',
    name: 'env',
    title: '环境',
    icon: IconGlobe,
    inSideMenu: true
  },
  {
    path: '/collection',
    name: 'collection',
    title: '集合',
    icon: IconSend,
    inSideMenu: true
  },
  {
    path: '/history',
    name: 'history',
    title: '请求历史',
    icon: IconAppCenter,
    inSideMenu: true
  },
  {
    path: '/terminal',
    name: 'terminal',
    title: '终端',
    icon: IconTerminal,
    inSideMenu: true
  },
]